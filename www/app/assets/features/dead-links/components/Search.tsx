import React, { useEffect, useState } from "react";
import { Input, Select } from "@chakra-ui/react";

import { DeadLinkFilterParamType, DeadLinkMetaType } from "../types";
import { useFormContext } from "react-hook-form";
import { BaseSearchForm } from "@/components/Form/BaseSearchForm";
import { BaseFieldWrapper } from "@/components/Form/BaseFieldWrapper";
import { useStatusOptions } from "@/features/misc/hooks/useStatusOptions";
import { CommonFilterParamType, OptionOptionType } from "@/types";
import { AuthMetaType } from "@/features/auth";
import { useDeadLinkMeta } from "../api/getDeadLinkMeta";
import { useAuth } from "@/lib/auth";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";

const Search = () => {
    const { getContentsFilter, setContentsFilter, setPagination } =
        useFilterParams();

    const { data: meta } = useDeadLinkMeta();
    const user = useAuth();
    const authMeta = user.user.data?.meta;

    const { register, reset } = useFormContext<DeadLinkFilterParamType>();

    const defaultValue = getContentsFilter();

    useEffect(() => {
        if (defaultValue) {
            reset(defaultValue);
        }
    }, [defaultValue]);

    return (
        <BaseSearchForm<DeadLinkFilterParamType>
            onSubmit={async (values) => {
                setContentsFilter({ ...values, page: 1 });
                setPagination(1);
            }}
        >
            <BaseFieldWrapper label="キーワード">
                <Input {...register("q")} />
            </BaseFieldWrapper>
        </BaseSearchForm>
    );
};

export default Search;
