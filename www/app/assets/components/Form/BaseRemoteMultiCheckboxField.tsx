import React, { useEffect } from "react";
import { CommonFieldOptionType, FormFieldType, MetaUtilityType } from "@/types";
import { Checkbox, CheckboxGroup, Input, Text } from "@chakra-ui/react";

import { FieldValues, Path, useController, useWatch } from "react-hook-form";

import { BaseFieldWrapper } from "./BaseFieldWrapper";
import { BaseConfirmView } from "../elements/Misc/BaseConfirmView";
import { getBaseFormFieldName } from "@/utils/getBaseFormFieldName";
import { getIsForeign } from "@/utils/getIsForeign";

type BaseRemoteMultiCheckboxFieldProps<T extends FieldValues> =
    FormFieldType<T> &
        CommonFieldOptionType & {
            meta: MetaUtilityType;
        };

export const BaseRemoteMultiCheckboxField = <T extends FieldValues>(
    props: BaseRemoteMultiCheckboxFieldProps<T>
) => {
    const {
        id,
        label,
        defaultValue,
        rule,
        meta,
        remoteDataKey,
        remoteDataIndexKey,
        remoteDataValueKey,
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

    const baseCheckedValues = baseValue
        ? multipleValueOptions
              ?.filter((item) => baseValue.includes(item.value))
              .map((item) => {
                  return item.label;
              })
              .join(",")
        : "";

    const formBaseEl = (
        <BaseConfirmView bg="gray.200">{baseCheckedValues}</BaseConfirmView>
    );

    if (isConfirm) {
        const checkedValues = value
            ? multipleValueOptions
                  ?.filter((item) => value.includes(item.value))
                  .map((item) => {
                      return item.label;
                  })
                  .join(",")
            : "";

        const formEl = <BaseConfirmView>{checkedValues}</BaseConfirmView>;

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
                {formEl}
            </BaseFieldWrapper>
        );
    }

    const formEl = (
        <CheckboxGroup onChange={onChange} value={value}>
            {multipleValueOptions?.map((item, index) => (
                <Checkbox
                    name={name}
                    value={item.value}
                    onBlur={onBlur}
                    ref={ref}
                    key={item.value}
                    checked={
                        Array.isArray(value) &&
                        value.find((val: string) => {
                            return val == item.value; //string[]
                        })
                    }
                    mr={4}
                    isRequired={false}
                    {...checkboxOptions}
                >
                    {item.label}
                </Checkbox>
            ))}
        </CheckboxGroup>
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
