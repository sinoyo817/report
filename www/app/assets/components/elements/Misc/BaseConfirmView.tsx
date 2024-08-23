import React from "react";
import { Box, BoxProps, Text, TextProps } from "@chakra-ui/react";

type BaseConfirmViewProps = {
    children: React.ReactNode;
} & Omit<TextProps, "children">;

export const BaseConfirmView = ({
    children,
    ...textProps
}: BaseConfirmViewProps) => {
    return (
        <Text
            w={"100%"}
            paddingInlineStart={4}
            paddingInlineEnd={4}
            pt="1.5"
            minH="10"
            bg={"inherit"}
            fontSize="md"
            pos="relative"
            {...textProps}
        >
            {children}
        </Text>
    );
};
