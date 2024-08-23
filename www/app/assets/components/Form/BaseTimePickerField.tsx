import React, { useEffect } from "react";
import { useRef } from "react";
import {
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Text,
} from "@chakra-ui/react";

import { FieldValues, Path, useController, useWatch } from "react-hook-form";

import "flatpickr/dist/themes/material_blue.css";
import { Japanese } from "flatpickr/dist/l10n/ja";

import Flatpickr from "react-flatpickr";
import DatePicker from "react-flatpickr";

import { BaseFieldWrapper } from "./BaseFieldWrapper";
import { CommonFieldOptionType, FormFieldType } from "@/types";
import { CloseIcon } from "@chakra-ui/icons";
import { BaseConfirmView } from "../elements/Misc/BaseConfirmView";
import { getBaseFormFieldName } from "@/utils/getBaseFormFieldName";
import { getIsForeign } from "@/utils/getIsForeign";

type BaseTimePickerFieldProps<T extends FieldValues> = FormFieldType<T> &
    CommonFieldOptionType;

export const BaseTimePickerField = <T extends FieldValues>(
    props: BaseTimePickerFieldProps<T>
) => {
    const {
        id,
        formType = "text",
        label,
        placeholder,
        defaultValue,
        rule,
        flatpickerOptions,
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

    const dateRef = useRef<DatePicker>(null);

    const formBaseEl = (
        <BaseConfirmView bg="gray.200">{baseValue}</BaseConfirmView>
    );

    if (isConfirm) {
        const formEl = <BaseConfirmView>{value}</BaseConfirmView>;
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
                <BaseConfirmView>{value}</BaseConfirmView>
            </BaseFieldWrapper>
        );
    }

    const formEl = (
        <Flatpickr
            defaultValue={defaultValue}
            render={({ defaultValue, value, ...props }, ref) => {
                return (
                    <InputGroup size="md">
                        <Input
                            ref={ref}
                            onBlur={onBlur}
                            name={name}
                            defaultValue={defaultValue}
                        />
                        <InputRightElement>
                            <IconButton
                                aria-label={"クリア"}
                                icon={<CloseIcon />}
                                onClick={(e) => {
                                    dateRef?.current?.flatpickr.clear();
                                }}
                                disabled={formControlOptions?.isDisabled}
                            />
                        </InputRightElement>
                    </InputGroup>
                );
            }}
            onChange={([selectedDates], dateStr, instance) => {
                onChange(dateStr);
            }}
            options={{
                dateFormat: "H:i",
                enableTime: true,
                minuteIncrement: 1,
                time_24hr: true,
                noCalendar: true,
                locale: Japanese,
            }}
            value={value}
            placeholder={placeholder}
            ref={dateRef}
            name={name}
            {...flatpickerOptions}
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
