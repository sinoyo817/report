import React, { useEffect } from "react";
import { Input, Select } from "@chakra-ui/react";

import { TopicFilterParamType } from "../types";
import { useFormContext } from "react-hook-form";
import { BaseSearchForm } from "@/components/Form/BaseSearchForm";
import { BaseFieldWrapper } from "@/components/Form/BaseFieldWrapper";
import { useStatusOptions } from "@/features/misc/hooks/useStatusOptions";
import { SearchPropsType } from "@/types";
import { BaseDatePeriodField } from "@/components/Form/BaseDatePeriodField";
import { useTopicMeta } from "../api/getTopicMeta";

const Search = (props: SearchPropsType) => {
    const { defaultValue, setContentsFilter, setPagination } = props;
    const statusOptions = useStatusOptions({ forSearch: true });

    const { register, reset } = useFormContext<TopicFilterParamType>();

    const { data: meta } = useTopicMeta();

    useEffect(() => {
        if (defaultValue) {
            reset(defaultValue);
        }
    }, [defaultValue]);

    return (
        <BaseSearchForm<TopicFilterParamType>
            onSubmit={async (values) => {
                setContentsFilter({ ...values, page: 1 });
                setPagination(1);
            }}
        >
            <BaseFieldWrapper label="キーワード">
                <Input {...register("q")} />
            </BaseFieldWrapper>
            {meta && meta.settings.category !== "no" && (
                <BaseFieldWrapper label="カテゴリ">
                    <Select
                        placeholder="---"
                        {...register(
                            meta.settings.category === "multi"
                                ? "master_topic_categories"
                                : "master_topic_category_id"
                        )}
                        w="72"
                    >
                        {meta.master_topic_categories &&
                            meta.master_topic_categories.map((item) => (
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
                        formType: "date",
                    },
                    end: {
                        id: "end_date",
                        formType: "date",
                    },
                }}
                model={""}
            />
        </BaseSearchForm>
    );
};

export default Search;
