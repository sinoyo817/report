import React, { useEffect } from "react";
import { Input, Select } from "@chakra-ui/react";

import { FreepageFilterParamType } from "../types";

import { useFreepageDirectoryMeta } from "../api/getFreepageDirectoryMeta";

import { useFormContext } from "react-hook-form";
import { BaseSearchForm } from "@/components/Form/BaseSearchForm";
import { BaseFieldWrapper } from "@/components/Form/BaseFieldWrapper";
import { useStatusOptions } from "@/features/misc/hooks/useStatusOptions";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";
import { SearchPropsType } from "@/types";

const Search = (props: SearchPropsType) => {
    const { defaultValue, setContentsFilter, setPagination } = props;
    const statusOptions = useStatusOptions({ forSearch: true });

    const { data: meta } = useFreepageDirectoryMeta();

    const { register, reset } = useFormContext<FreepageFilterParamType>();

    useEffect(() => {
        if (defaultValue) {
            reset(defaultValue);
        }
    }, [defaultValue]);

    return (
        <BaseSearchForm<FreepageFilterParamType>
            onSubmit={async (values) => {
                setContentsFilter({ ...values, page: 1 });
                setPagination(1);
            }}
        >
            <BaseFieldWrapper label="キーワード">
                <Input {...register("q")} />
            </BaseFieldWrapper>
            <BaseFieldWrapper label="階層">
                <Select placeholder="---" {...register("parent_id")}>
                    {meta &&
                        meta.master_freepage_directories &&
                        Object.entries(meta.master_freepage_directories).map(
                            ([key, title]) => (
                                <option key={key} value={key}>
                                    {title}
                                </option>
                            )
                        )}
                </Select>
            </BaseFieldWrapper>
            <BaseFieldWrapper label="タイプ">
                <Select placeholder="---" {...register("type")} w="72">
                    {meta &&
                        meta.master_freepage_types &&
                        Object.entries(meta.master_freepage_types).map(
                            ([key, title]) => (
                                <option key={key} value={key}>
                                    {title}
                                </option>
                            )
                        )}
                </Select>
            </BaseFieldWrapper>
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
            <BaseFieldWrapper label="ステータス">
                <Select placeholder="---" {...register("status")} w="72">
                    {statusOptions &&
                        statusOptions.map((item) => (
                            <option key={item.status} value={item.status}>
                                {item.title}
                            </option>
                        ))}
                </Select>
            </BaseFieldWrapper>
        </BaseSearchForm>
    );
};

export default Search;
