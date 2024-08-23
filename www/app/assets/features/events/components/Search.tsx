import React, { useEffect } from "react";
import { Input, Select } from "@chakra-ui/react";

import { EventFilterParamType } from "../types";

import { useEventMeta } from "../api/getEventMeta";

import { useFormContext } from "react-hook-form";
import { BaseSearchForm } from "@/components/Form/BaseSearchForm";
import { BaseFieldWrapper } from "@/components/Form/BaseFieldWrapper";
import { useStatusOptions } from "@/features/misc/hooks/useStatusOptions";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";
import { BaseDatePeriodField } from "@/components/Form/BaseDatePeriodField";
import { SearchPropsType } from "@/types";

const Search = (props: SearchPropsType) => {
    const { defaultValue, setContentsFilter, setPagination } = props;
    const statusOptions = useStatusOptions({ forSearch: true });

    const { data: meta } = useEventMeta();

    const { register, reset } = useFormContext<EventFilterParamType>();

    useEffect(() => {
        if (defaultValue) {
            reset(defaultValue);
        }
    }, [defaultValue]);

    return (
        <BaseSearchForm<EventFilterParamType>
            onSubmit={async (values) => {
                setContentsFilter({ ...values, page: 1 });
                setPagination(1);
            }}
        >
            <BaseFieldWrapper label="キーワード">
                <Input {...register("q")} />
            </BaseFieldWrapper>
            {meta && meta.settings.area !== "no" && (
                <BaseFieldWrapper label="エリア">
                    <Select
                        placeholder="---"
                        {...register(
                            meta.settings.area === "multi"
                                ? "areas"
                                : "master_area_id"
                        )}
                        w="72"
                    >
                        {meta.master_areas &&
                            meta.master_areas.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.title}
                                </option>
                            ))}
                    </Select>
                </BaseFieldWrapper>
            )}
            {meta && meta.settings.category !== "no" && (
                <BaseFieldWrapper label="カテゴリ">
                    <Select
                        placeholder="---"
                        {...register(
                            meta.settings.category === "multi"
                                ? "master_event_categories"
                                : "master_event_category_id"
                        )}
                        w="72"
                    >
                        {meta.master_event_categories &&
                            meta.master_event_categories.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.title}
                                </option>
                            ))}
                    </Select>
                </BaseFieldWrapper>
            )}
            <BaseFieldWrapper label="公開状態">
                <Select placeholder="---" {...register("public")} w="72">
                    {statusOptions &&
                        statusOptions
                            .filter(
                                (item) =>
                                    item.status === "published" ||
                                    item.status === "unpublished"
                            )
                            .map((item) => (
                                <option key={item.status} value={item.status}>
                                    {item.title}
                                </option>
                            ))}
                </Select>
            </BaseFieldWrapper>
            <BaseDatePeriodField
                id={"start_end"}
                formType={"input"}
                periodLabel="公開期間"
                periodConnector="~"
                periodGroup={{
                    start: {
                        id: "start_date",
                        formType: "datetime",
                    },
                    end: {
                        id: "end_date",
                        formType: "datetime",
                    },
                }}
                model={""}
            />
        </BaseSearchForm>
    );
};

export default Search;
