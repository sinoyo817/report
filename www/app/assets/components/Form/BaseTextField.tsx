import React, { useEffect } from "react";
import { CommonFieldOptionType, FormFieldType } from "@/types";
import { Input, Text, Textarea } from "@chakra-ui/react";

import {
    FieldValues,
    Path,
    useController,
    useFormContext,
    useWatch,
} from "react-hook-form";

import { BaseFieldWrapper } from "./BaseFieldWrapper";
import { Interweave } from "interweave";
import { BaseConfirmView } from "../elements/Misc/BaseConfirmView";
import { getIsForeign } from "@/utils/getIsForeign";
import { getBaseFormFieldName } from "@/utils/getBaseFormFieldName";

type BaseTextFieldProps<T extends FieldValues> = FormFieldType<T> &
    CommonFieldOptionType & { allowIframe?: boolean };

export const BaseTextField = <T extends FieldValues>(
    props: BaseTextFieldProps<T>
) => {
    const {
        id,
        label,
        placeholder,
        defaultValue,
        rule,
        textareaOptions,
        formControlOptions,
        isConfirm,
        helpText,
        allowIframe = false,
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

    const allowList = allowIframe ? ["iframe", "br"] : ["br"];
    const formBaseEl = (
        <BaseConfirmView bg="gray.200" maxH="40" overflowY="scroll">
            <Interweave content={baseValue} noWrap allowList={allowList} />
        </BaseConfirmView>
    );

    if (isConfirm) {
        const formEl = (
            <BaseConfirmView>
                <Interweave content={value} noWrap allowList={allowList} />
            </BaseConfirmView>
        );
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
        <Textarea
            placeholder={placeholder}
            onChange={onChange}
            name={name}
            value={value}
            onBlur={onBlur}
            ref={ref}
            isRequired={false}
            {...textareaOptions}
        />
    );

    return (
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
                                />
                            )}
                        </>
                    )}
                </>
            ) : (
                <>{formEl}</>
            )}
        </BaseFieldWrapper>
    );
};
