import React from "react";
import { useRef } from "react";
import {
    Box,
    FormControl,
    FormLabel,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    Wrap,
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
import { getIsForeign } from "@/utils/getIsForeign";
import { getBaseFormFieldName } from "@/utils/getBaseFormFieldName";

type OmitFormFieldType<T extends FieldValues> = Omit<
    FormFieldType<T>,
    "periodGroup"
>;

type RequiredPeriodGroup<T extends FieldValues> = Required<
    Pick<FormFieldType<T>, "periodGroup">
>;

type BaseDatePeriodFieldProps<T extends FieldValues> = OmitFormFieldType<T> &
    RequiredPeriodGroup<T> &
    CommonFieldOptionType;

export const BaseDatePeriodField = <T extends FieldValues>(
    props: BaseDatePeriodFieldProps<T>
) => {
    const {
        periodLabel,
        periodGroup,
        periodConnector,
        isConfirm,
        formControlOptions,
        locale,
        ignoreForeign,
        useDefaultLocaleData,
    } = props;

    const isForeign = getIsForeign({ locale });

    const start = periodGroup.start;
    const startFieldName = getBaseFormFieldName({
        field: `${start.id}`,
        isForeign: isForeign,
    }) as Path<T>;
    const end = periodGroup.end;
    const endFieldName = getBaseFormFieldName({
        field: `${end.id}`,
        isForeign: isForeign,
    }) as Path<T>;

    const { field: startField, fieldState: startFieldState } = useController<T>(
        {
            name: start.id,
            defaultValue: start.defaultValue,
            rules: start.rule,
        }
    );

    const { field: endField, fieldState: endFieldState } = useController<T>({
        name: end.id,
        defaultValue: end.defaultValue,
        rules: end.rule,
    });

    const startBaseValue = useWatch({ name: startFieldName });
    const endBaseValue = useWatch({ name: endFieldName });

    const startRef = useRef<DatePicker>(null);
    const endRef = useRef<DatePicker>(null);

    const formBaseEl = (
        <Wrap>
            <HStack spacing={1} justify="center">
                <BaseFieldWrapper w="60">
                    <BaseConfirmView bg="gray.200">
                        {startBaseValue}
                    </BaseConfirmView>
                </BaseFieldWrapper>
            </HStack>
            {periodConnector && (
                <Box whiteSpace="nowrap" pt={1} fontSize="lg">
                    {periodConnector}
                </Box>
            )}
            <HStack spacing={1} justify="center">
                <BaseFieldWrapper w="60">
                    <BaseConfirmView bg="gray.200">
                        {endBaseValue}
                    </BaseConfirmView>
                </BaseFieldWrapper>
            </HStack>
        </Wrap>
    );

    if (isConfirm) {
        const formEl = (
            <Wrap>
                <HStack spacing={1} justify="center">
                    <BaseFieldWrapper w="60">
                        <BaseConfirmView bg="gray.200">
                            {startField.value}
                        </BaseConfirmView>
                    </BaseFieldWrapper>
                </HStack>
                {(startField.value || endField.value) && periodConnector && (
                    <Box whiteSpace="nowrap" pt={1} fontSize="lg">
                        {periodConnector}
                    </Box>
                )}
                <HStack spacing={1} justify="center">
                    <BaseFieldWrapper w="60">
                        <BaseConfirmView bg="gray.200">
                            {endField.value}
                        </BaseConfirmView>
                    </BaseFieldWrapper>
                </HStack>
            </Wrap>
        );
        if (isForeign) {
            return (
                <>
                    <FormLabel>
                        <Text as="span" size="xs" fontWeight="bold">
                            {periodLabel}
                        </Text>
                    </FormLabel>

                    {formBaseEl}

                    {!ignoreForeign && !useDefaultLocaleData && <>{formEl}</>}
                </>
            );
        }
        return (
            <>
                <FormLabel>
                    <Text as="span" size="xs" fontWeight="bold">
                        {periodLabel}
                    </Text>
                </FormLabel>
                <>{formEl}</>
            </>
        );
    }

    const formEl = (
        <Wrap>
            <HStack spacing={1} justify="center">
                <BaseFieldWrapper
                    error={startFieldState.error}
                    {...start.formControlOptions}
                    className={"flatpickr"}
                >
                    <Flatpickr
                        defaultValue={start.defaultValue}
                        render={({ defaultValue, value, ...props }, ref) => {
                            return (
                                <InputGroup size="md">
                                    <Input
                                        ref={ref}
                                        onBlur={startField.onBlur}
                                        defaultValue={defaultValue}
                                    />
                                    <InputRightElement>
                                        <IconButton
                                            aria-label={"クリア"}
                                            icon={<CloseIcon />}
                                            onClick={(e) => {
                                                startRef?.current?.flatpickr.clear();
                                            }}
                                            disabled={
                                                start.formControlOptions
                                                    ?.isDisabled
                                            }
                                        />
                                    </InputRightElement>
                                </InputGroup>
                            );
                        }}
                        onChange={([selectedDates], dateStr, instance) => {
                            startField.onChange(dateStr);
                            endRef?.current?.flatpickr.set("minDate", dateStr);
                        }}
                        options={{
                            maxDate: endField.value || undefined,
                            dateFormat:
                                start.formType === "datetime"
                                    ? "Y-m-d H:i:S"
                                    : "Y-m-d",
                            enableTime:
                                start.formType === "datetime" ? true : false,
                            locale: Japanese,
                            disableMobile: true,
                            minuteIncrement: 10,
                        }}
                        value={startField.value}
                        placeholder={start.placeholder}
                        name={startField.name}
                        ref={startRef}
                        {...start.flatpickerOptions}
                    />
                </BaseFieldWrapper>
                {periodConnector && (
                    <Box whiteSpace="nowrap" pb={4} pl={1} fontSize="lg">
                        {periodConnector}
                    </Box>
                )}
            </HStack>
            <HStack spacing={5}>
                <BaseFieldWrapper
                    error={endFieldState.error}
                    {...end.formControlOptions}
                >
                    <Flatpickr
                        defaultValue={end.defaultValue}
                        render={({ defaultValue, value, ...props }, ref) => {
                            return (
                                <InputGroup size="md">
                                    <Input
                                        ref={ref}
                                        onBlur={endField.onBlur}
                                        defaultValue={defaultValue}
                                    />
                                    <InputRightElement>
                                        <IconButton
                                            aria-label={"クリア"}
                                            icon={<CloseIcon />}
                                            onClick={(e) => {
                                                endRef?.current?.flatpickr.clear();
                                            }}
                                            disabled={
                                                end.formControlOptions
                                                    ?.isDisabled
                                            }
                                        />
                                    </InputRightElement>
                                </InputGroup>
                            );
                        }}
                        onChange={([selectedDates], dateStr, instance) => {
                            endField.onChange(dateStr);
                            startRef?.current?.flatpickr.set(
                                "maxDate",
                                dateStr
                            );
                        }}
                        options={{
                            minDate: startField.value || undefined,
                            dateFormat:
                                end.formType === "datetime"
                                    ? "Y-m-d H:i:S"
                                    : "Y-m-d",
                            enableTime:
                                end.formType === "datetime" ? true : false,
                            locale: Japanese,
                            disableMobile: true,
                            minuteIncrement: 10,
                        }}
                        value={endField.value}
                        placeholder={end.placeholder}
                        name={endField.name}
                        ref={endRef}
                        {...end.flatpickerOptions}
                    />
                </BaseFieldWrapper>
            </HStack>
        </Wrap>
    );

    return (
        <FormControl m={0} {...formControlOptions}>
            <FormLabel>
                <Text as="span" size="xs" fontWeight="bold">
                    {periodLabel}
                </Text>
            </FormLabel>
            {isForeign ? (
                <>
                    {formBaseEl}
                    {!ignoreForeign && (
                        <>
                            {!useDefaultLocaleData ? (
                                <>{formEl}</>
                            ) : (
                                <>
                                    <Input
                                        type={"hidden"}
                                        onChange={startField.onChange}
                                        name={startField.name}
                                        value={startBaseValue}
                                        onBlur={startField.onBlur}
                                        ref={startField.ref}
                                        isRequired={false}
                                    />
                                    <Input
                                        type={"hidden"}
                                        onChange={endField.onChange}
                                        name={endField.name}
                                        value={endBaseValue}
                                        onBlur={endField.onBlur}
                                        ref={endField.ref}
                                        isRequired={false}
                                    />
                                </>
                            )}
                        </>
                    )}
                </>
            ) : (
                <>{formEl}</>
            )}
        </FormControl>
    );
};
