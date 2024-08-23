import React from "react";
import { CommonFieldOptionType, FormFieldType } from "@/types";
import { Box, Checkbox, CheckboxGroup, Text } from "@chakra-ui/react";

import { FieldValues, useController } from "react-hook-form";

import { BaseFieldWrapper } from "@/components/Form/BaseFieldWrapper";
import { BaseConfirmView } from "@/components/elements/Misc/BaseConfirmView";

type DirectoryCheckboxProps<T extends FieldValues> = Omit<
    FormFieldType<T>,
    "multipleValueOptions"
> &
    CommonFieldOptionType & {
        multipleValueOptions: {
            label?: string;
            value: number | string;
            depth: number;
        }[];
    };

export const DirectoryCheckbox = <T extends FieldValues>(
    props: DirectoryCheckboxProps<T>
) => {
    const {
        id,
        label,
        defaultValue,
        rule,
        multipleValueOptions,
        checkboxOptions,
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

    if (isConfirm) {
        const checkedValues = value
            ? multipleValueOptions
                  ?.filter((item) => value.includes(item.value))
                  .map((item) => {
                      return item.label;
                  })
                  .join(",")
            : "";
        return (
            <BaseFieldWrapper label={label} {...formControlOptions}>
                <BaseConfirmView>{checkedValues}</BaseConfirmView>
            </BaseFieldWrapper>
        );
    }

    return (
        <BaseFieldWrapper
            label={label}
            error={fieldState.error}
            helpText={helpText}
            {...formControlOptions}
        >
            <CheckboxGroup onChange={onChange} value={value}>
                {multipleValueOptions?.map((item, index) => (
                    <Box style={{ marginInlineStart: item.depth * 20 }}>
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
                            {...checkboxOptions}
                        >
                            {item.label}
                        </Checkbox>
                    </Box>
                ))}
            </CheckboxGroup>
        </BaseFieldWrapper>
    );
};
