import React, { useEffect } from "react";
import { Input, Select } from "@chakra-ui/react";

import { FileFilterParamType } from "../types";

import { useFormContext } from "react-hook-form";
import { BaseSearchForm } from "@/components/Form/BaseSearchForm";
import { BaseFieldWrapper } from "@/components/Form/BaseFieldWrapper";
import { useStatusOptions } from "@/features/misc/hooks/useStatusOptions";
import { useFileMeta } from "../api/getFilesMeta";
import { SearchPropsType } from "@/types";

const Search = (props: SearchPropsType) => {
    const { defaultValue, setContentsFilter, setPagination } = props;
    const statusOptions = useStatusOptions({ forSearch: true });

    const { data: meta } = useFileMeta();

    const { register, reset } = useFormContext<FileFilterParamType>();

    useEffect(() => {
        if (defaultValue) {
            reset(defaultValue);
        }
    }, [defaultValue]);

    return (
        <BaseSearchForm<FileFilterParamType>
            onSubmit={async (values) => {
                setContentsFilter({ ...values, page: 1 });
                setPagination(1);
            }}
        >
            <BaseFieldWrapper label="キーワード">
                <Input {...register("q")} />
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
            <BaseFieldWrapper label="コンテンツ">
                <Select placeholder="---" {...register("model")} w="72">
                    {meta &&
                        Object.entries(meta.all_contents).map(
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
                    <option value="image">画像</option>

                    <option value="file">ファイル</option>
                </Select>
            </BaseFieldWrapper>
        </BaseSearchForm>
    );
};

export default Search;
