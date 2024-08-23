import React, { useEffect } from "react";
import { CommonFieldOptionType, FormFieldType, MetaUtilityType } from "@/types";
import { Checkbox, CheckboxGroup, Input, Text } from "@chakra-ui/react";

import { FieldValues, Path, useController, useWatch } from "react-hook-form";

import { BaseFieldWrapper } from "./BaseFieldWrapper";
import { BaseConfirmView } from "../elements/Misc/BaseConfirmView";
import { getIsForeign } from "@/utils/getIsForeign";
import { getBaseFormFieldName } from "@/utils/getBaseFormFieldName";

type BaseRemoteCheckboxFieldProps<T extends FieldValues> = FormFieldType<T> &
    CommonFieldOptionType & {
        meta: MetaUtilityType;
    };

export const BaseRemoteCheckboxField = <T extends FieldValues>(
    props: BaseRemoteCheckboxFieldProps<T>
) => {
    const {
        id,
        label,
        defaultValue,
        rule,
        meta,
        remoteDataKey,
        checkboxOnDisplayText,
        checkboxOffDisplayText,
        checkboxOptions,
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

    const remoteData = remoteDataKey && meta[remoteDataKey];

    if (!remoteData || Array.isArray(remoteData)) {
        return <></>;
    }

    const checkboxValueOption = {
        label: Object.values(remoteData)[0],
        value: Object.keys(remoteData)[0],
    };

    const checkedBaseValue =
        baseValue == checkboxOptions?.value
            ? checkboxOnDisplayText || checkboxValueOption.label || ""
            : checkboxOffDisplayText || "";

    const formBaseEl = (
        <BaseConfirmView bg="gray.200">{checkedBaseValue}</BaseConfirmView>
    );

    if (isConfirm) {
        const checkedValue =
            value == checkboxOptions?.value
                ? checkboxOnDisplayText || checkboxValueOption.label || ""
                : checkboxOffDisplayText || "";

        const formEl = <BaseConfirmView>{checkedValue}</BaseConfirmView>;

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
                <BaseConfirmView>{checkedValue}</BaseConfirmView>
            </BaseFieldWrapper>
        );
    }

    const formEl = (
        <Checkbox
            name={name}
            value={checkboxValueOption.value}
            onBlur={onBlur}
            ref={ref}
            onChange={(e) => {
                onChange(
                    e.target.checked ? checkboxValueOption.value : defaultValue
                );
            }}
            checked={checkboxValueOption.value == value}
            isChecked={checkboxValueOption.value == value}
            isRequired={false}
            {...checkboxOptions}
        >
            {checkboxValueOption.label}
        </Checkbox>
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
