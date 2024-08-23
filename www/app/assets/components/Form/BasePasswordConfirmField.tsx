import React from "react";
import { CommonFieldOptionType, FormFieldType } from "@/types";
import { Box, Input, Text } from "@chakra-ui/react";

import { FieldValues, useController } from "react-hook-form";

import { BaseFieldWrapper } from "./BaseFieldWrapper";
import { BaseConfirmView } from "../elements/Misc/BaseConfirmView";

type BaseInputFieldProps<T extends FieldValues> = FormFieldType<T> &
    CommonFieldOptionType;

export const BasePasswordConfirmField = <T extends FieldValues>(
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
    } = props;

    const {
        field: { onChange, onBlur, name, value, ref },
        fieldState,
    } = useController<T>({
        name: id,
        defaultValue: defaultValue,
        rules: rule,
    });

    const confirmName = `${id}_confirm`;

    const { field: confirmField, fieldState: confirmFieldState } =
        useController<T>({
            name: confirmName as any,
            defaultValue: "" as any,
            rules: {
                validate: {
                    message: (input) =>
                        input === value
                            ? undefined
                            : "パスワード確認用と入力内容が合いません",
                },
            },
        });

    if (isConfirm) {
        return (
            <BaseFieldWrapper label={label} {...formControlOptions}>
                <BaseConfirmView>
                    <></>
                </BaseConfirmView>
            </BaseFieldWrapper>
        );
    }

    return (
        <Box>
            <BaseFieldWrapper
                label={label}
                error={fieldState.error}
                helpText={helpText}
                {...formControlOptions}
            >
                <Input
                    type={"password"}
                    placeholder={placeholder}
                    onChange={onChange}
                    name={name}
                    value={value}
                    onBlur={onBlur}
                    ref={ref}
                    {...inputOptions}
                />
            </BaseFieldWrapper>
            <BaseFieldWrapper
                label={"パスワード確認用"}
                error={confirmFieldState.error}
            >
                <Input
                    type={"password"}
                    onChange={confirmField.onChange}
                    name={confirmField.name}
                    value={confirmField.value}
                    onBlur={confirmField.onBlur}
                    ref={confirmField.ref}
                />
            </BaseFieldWrapper>
        </Box>
    );
};
