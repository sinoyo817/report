import React, { useEffect } from "react";
import { Input, Select } from "@chakra-ui/react";

import { MasterGroupFilterParamType } from "../types";

import { useFormContext } from "react-hook-form";
import { BaseSearchForm } from "@/components/Form/BaseSearchForm";
import { BaseFieldWrapper } from "@/components/Form/BaseFieldWrapper";
import { useStatusOptions } from "@/features/misc/hooks/useStatusOptions";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";


const Search = () => {
    const { getContentsFilter, setContentsFilter, setPagination } =
        useFilterParams();
    const statusOptions = useStatusOptions({ forSearch: true });

  

    const { register, reset } = useFormContext<MasterGroupFilterParamType>();

    const defaultValue = getContentsFilter();

    useEffect(() => {
        if (defaultValue) {
            reset(defaultValue);
        }
    }, [defaultValue]);


    return (
        <BaseSearchForm<MasterGroupFilterParamType>
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
