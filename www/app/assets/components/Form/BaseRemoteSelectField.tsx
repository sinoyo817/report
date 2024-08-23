import React, { useEffect } from "react";
import { CommonFieldOptionType, FormFieldType, MetaUtilityType } from "@/types";
import { Input, Select, Text } from "@chakra-ui/react";

import { FieldValues, Path, useController, useWatch } from "react-hook-form";

import { BaseFieldWrapper } from "./BaseFieldWrapper";
import { BaseConfirmView } from "../elements/Misc/BaseConfirmView";
import { getBaseFormFieldName } from "@/utils/getBaseFormFieldName";
import { getIsForeign } from "@/utils/getIsForeign";

type BaseRemoteSelectFieldProps<T extends FieldValues> = FormFieldType<T> &
    CommonFieldOptionType & {
        meta: MetaUtilityType;
    };

export const BaseRemoteSelectField = <T extends FieldValues>(
    props: BaseRemoteSelectFieldProps<T>
) => {
    const {
        id,
        label,
        defaultValue,
        rule,
        placeholder,
        meta,
        remoteDataKey,
        remoteDataIndexKey,
        remoteDataValueKey,
        selectOptions,
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

    if (!remoteData) {
        return <></>;
    }

    const multipleValueOptions = Array.isArray(remoteData)
        ? remoteDataIndexKey &&
          remoteDataValueKey &&
          remoteData.map((item) => ({
              label: item[remoteDataIndexKey],
              value: item[remoteDataValueKey],
          }))
        : Object.entries(remoteData).map(([key, title]) => ({
              label: title,
              value: key,
          }));

    if (!multipleValueOptions) {
        return <></>;
    }

    const selectedBaseValue = multipleValueOptions?.find(
        (item) => item.value == baseValue
    );

    const formBaseEl = (
        <BaseConfirmView bg="gray.200">
            {selectedBaseValue?.label}
        </BaseConfirmView>
    );

    if (isConfirm) {
        const selectedValue = multipleValueOptions?.find(
            (item) => item.value == value
        );

        const formEl = (
            <BaseConfirmView>{selectedValue?.label}</BaseConfirmView>
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
        <Select
            onChange={onChange}
            name={name}
            ref={ref}
            value={value}
            placeholder={placeholder}
            w="72"
            isRequired={false}
            {...selectOptions}
        >
            {multipleValueOptions?.map((item, index) => (
                <option value={item.value} key={item.value}>
                    {item.label}
                </option>
            ))}
        </Select>
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
