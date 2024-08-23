import React, { useEffect } from "react";
import { Input, Select } from "@chakra-ui/react";

import { AdminFilterParamType } from "../types";
import { useFormContext } from "react-hook-form";
import { BaseSearchForm } from "@/components/Form/BaseSearchForm";
import { BaseFieldWrapper } from "@/components/Form/BaseFieldWrapper";
import { useStatusOptions } from "@/features/misc/hooks/useStatusOptions";
import { CommonFilterParamType, SearchPropsType } from "@/types";
import { useAdminMeta } from "../api/getAdminMeta";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";

const Search = (props: SearchPropsType) => {
    const { defaultValue, setContentsFilter, setPagination } = props;
    const statusOptions = useStatusOptions({ forSearch: true });

    const { data: meta } = useAdminMeta();

    const { register, reset } = useFormContext<AdminFilterParamType>();

    useEffect(() => {
        if (defaultValue) {
            reset(defaultValue);
        }
    }, [defaultValue]);

    return (
        <BaseSearchForm<AdminFilterParamType>
            onSubmit={async (values) => {
                setContentsFilter({ ...values, page: 1 });
                setPagination(1);
            }}
        >
            <BaseFieldWrapper label="キーワード">
                <Input {...register("q")} />
            </BaseFieldWrapper>
            <BaseFieldWrapper label="権限">
                <Select placeholder="---" {...register("role")} w="72">
                    {meta?.role &&
                        meta.role.map((item) => (
                            <option key={item.role} value={item.role}>
                                {item.title}
                            </option>
                        ))}
                </Select>
            </BaseFieldWrapper>
            <BaseFieldWrapper label="公開状態">
                <Select placeholder="---" {...register("public")} w="72">
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
