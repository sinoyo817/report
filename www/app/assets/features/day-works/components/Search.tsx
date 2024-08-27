import React, { useEffect } from "react";
import { Input, Select } from "@chakra-ui/react";

import { DayWorkFilterParamType } from "../types";

import { useDayWorkMeta } from "../api/getDayWorkMeta";

import { useFormContext } from "react-hook-form";
import { BaseSearchForm } from "@/components/Form/BaseSearchForm";
import { BaseFieldWrapper } from "@/components/Form/BaseFieldWrapper";
import { useStatusOptions } from "@/features/misc/hooks/useStatusOptions";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";
import { BaseDatePeriodField } from "@/components/Form/BaseDatePeriodField";


const Search = () => {
    const { getContentsFilter, setContentsFilter, setPagination } =
        useFilterParams();
    const statusOptions = useStatusOptions({ forSearch: true });

    const { data: meta } = useDayWorkMeta();

    const { register, reset } = useFormContext<DayWorkFilterParamType>();

    const defaultValue = getContentsFilter();

    useEffect(() => {
        if (defaultValue) {
            reset(defaultValue);
        }
    }, [defaultValue]);

    return (
        <BaseSearchForm<DayWorkFilterParamType>
           onSubmit={async (values) => {
                setContentsFilter({ ...values, page: 1 });
                setPagination(1);
            }}
        >
            <BaseFieldWrapper label="キーワード">
                <Input {...register("q")} />
            </BaseFieldWrapper>
            <BaseDatePeriodField
                id={"start_end"}
                formType={"input"}
                periodLabel="対象期間"
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
