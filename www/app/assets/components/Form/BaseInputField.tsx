import React, { useEffect } from "react";
import { CommonFieldOptionType, FormFieldType } from "@/types";
import { Box, Input, Text } from "@chakra-ui/react";

import {
    FieldValues,
    Path,
    useController,
    useFormContext,
    useWatch,
} from "react-hook-form";

import { BaseFieldWrapper } from "./BaseFieldWrapper";
import { BaseConfirmView } from "../elements/Misc/BaseConfirmView";
import { getBaseFormFieldName } from "@/utils/getBaseFormFieldName";
import { getIsForeign } from "@/utils/getIsForeign";

type BaseInputFieldProps<T extends FieldValues> = FormFieldType<T> &
    CommonFieldOptionType;

export const BaseInputField = <T extends FieldValues>(
    props: BaseInputFieldProps<T>
) => {
    const {
        id,
        inputType = "text",
        label,
        placeholder,
        defaultValue,
        rule,
        inputOptions,
        formControlOptions,
        isConfirm,
        helpText,
        locale,
        ignoreForeign,
        useDefaultLocaleData,
    } = props;

    const isForeign = getIsForeign({ locale });

    const fieldName = getBaseFormFieldName({
        field: `${id}`,
        isForeign: isForeign,
    }) as Path<T>;

    const {
        field: { onChange, onBlur, name, value, ref },
        fieldState,
    } = useController<T>({
        name: id,
        defaultValue: defaultValue,
        rules: rule,
    });

    const baseValue = useWatch({ name: fieldName });

    useEffect(() => {
        if (useDefaultLocaleData && isForeign && baseValue) {
            onChange(baseValue);
        }
    }, [isForeign, useDefaultLocaleData, baseValue]);

    const formBaseEl = (
        <>
            {!["hidden", "password"].includes(inputType) && (
                <BaseConfirmView bg="gray.200">{baseValue}</BaseConfirmView>
            )}
        </>
    );

    if (isConfirm) {
        const filterValue = ["hidden", "password"].includes(inputType)
            ? ""
            : value;

        const formEl = <BaseConfirmView>{filterValue}</BaseConfirmView>;

        if (isForeign) {
            return (
                <BaseFieldWrapper label={label} {...formControlOptions}>
                    {formBaseEl}
                    {!ignoreForeign && !useDefaultLocaleData && <>{formEl}</>}
                </BaseFieldWrapper>
            );
        }

        return (
            <BaseFieldWrapper label={label} {...formControlOptions}>
                <>{formEl}</>
            </BaseFieldWrapper>
        );
    }
    const formEl = (
        <Input
            type={inputType}
            placeholder={placeholder}
            onChange={onChange}
            name={name}
            value={value}
            onBlur={onBlur}
            ref={ref}
            isRequired={false}
            {...inputOptions}
        />
    );

    return (
        <>
            <BaseFieldWrapper
                label={label}
                error={fieldState.error}
                helpText={helpText}
                {...formControlOptions}
            >
                {isForeign ? (
                    <>
                        {formBaseEl}
                        {!ignoreForeign && (
                            <>
                                {!useDefaultLocaleData ? (
                                    <>{formEl}</>
                                ) : (
                                    <Input
                                        type={"hidden"}
                                        placeholder={placeholder}
                                        onChange={onChange}
                                        name={name}
                                        value={baseValue}
                                        onBlur={onBlur}
                                        ref={ref}
                                        isRequired={false}
                                        {...inputOptions}
                                    />
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <>{formEl}</>
                )}
            </BaseFieldWrapper>
        </>
    );
};
