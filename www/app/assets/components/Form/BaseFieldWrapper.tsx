import React from "react";
import {
    FormControl,
    FormControlProps,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Heading,
    HStack,
    Text,
} from "@chakra-ui/react";
import { FieldError } from "react-hook-form";

type FormControlPropsOmited = Omit<FormControlProps, "label" | "children">;

type FieldWrapperProps = FormControlPropsOmited & {
    label?: React.ReactNode;
    children: React.ReactNode;
    error?: FieldError | undefined;
    helpText?: React.ReactNode;
};

export type FieldWrapperPassThroughProps = Omit<FieldWrapperProps, "children">;

export const BaseFieldWrapper = (props: FieldWrapperProps) => {
    const { label, error, children, helpText, ...options } = props;
    const isError = error !== undefined ? true : false;
    return (
        <FormControl isInvalid={isError} {...options} mb={4}>
            {label && (
                <FormLabel>
                    <Text as="span" size="xs" fontWeight="bold" mb={2}>
                        {label}
                    </Text>
                </FormLabel>
            )}
            {children}
            {error
                ? error.types
                    ? Object.values(error.types).map((err, index) => (
                          <FormErrorMessage key={`error-${index}`}>
                              {err}
                          </FormErrorMessage>
                      ))
                    : error.message && (
                          <FormErrorMessage>{error.message}</FormErrorMessage>
                      )
                : helpText && <FormHelperText>{helpText}</FormHelperText>}
        </FormControl>
    );
};
