import React from "react";
import { Box, useRadio, UseRadioProps } from "@chakra-ui/react";

type FileRadioWrapperProp = UseRadioProps & {
    children: React.ReactNode;
};

export const FileRadioWrapper = (props: FileRadioWrapperProp) => {
    const { children, ...radioProps } = props;
    const { getInputProps, getCheckboxProps } = useRadio(radioProps);

    const input = getInputProps();
    const checkbox = getCheckboxProps();

    return (
        <Box as="label" display="block" position="relative">
            <input {...input} />
            <Box
                {...checkbox}
                cursor="pointer"
                borderRadius="md"
                boxShadow="md"
                _checked={{
                    bg: "cyan.50",
                    color: "black",
                    borderColor: "cyan.100",
                }}
                _focus={{
                    boxShadow: "outline",
                }}
                p="1"
                m="1"
            >
                {children}
            </Box>
        </Box>
    );
};
