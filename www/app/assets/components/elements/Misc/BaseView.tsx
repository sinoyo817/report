import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";

type BaseViewProps = {
    children: React.ReactNode;
} & Omit<BoxProps, "children">;

export const BaseView = ({ children, ...boxProps }: BaseViewProps) => {
    return (
        <Box
            bg={"whiteAlpha.800"}
            borderWidth="1px"
            p="5"
            my="5"
            rounded="2xl"
            {...boxProps}
        >
            {children}
        </Box>
    );
};
