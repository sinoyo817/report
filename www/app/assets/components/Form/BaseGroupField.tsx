import React from "react";
import { Box, Center, Heading } from "@chakra-ui/react";

import { FieldValues } from "react-hook-form";

import { CommonFieldOptionType, FormFieldType } from "@/types";
import { GenerateFields } from "./GenerateFields";

type BaseGroupFieldTypeProps<T extends FieldValues> = FormFieldType<T> &
    CommonFieldOptionType;

export const BaseGroupField = <T extends FieldValues>(
    props: BaseGroupFieldTypeProps<T>
) => {
    const { groupLabel, group, isConfirm, model, locale } = props;
    if (!group) {
        return <></>;
    }

    const elements = GenerateFields<T>({
        fields: group,
        isConfirm: isConfirm,
        model: model,
        locale: locale,
    });

    return (
        <Box bg={"white"} borderWidth="1px" p="5" my="5" rounded="2xl">
            {groupLabel && (
                <Center
                    bg="gray.100"
                    h="30px"
                    w="full"
                    p=""
                    justifyContent="center"
                    alignItems="center"
                    display="inline-flex"
                    my="3"
                >
                    <Heading as="h6" size="md">
                        {groupLabel}
                    </Heading>
                </Center>
            )}
            <Box py="3">{elements}</Box>
        </Box>
    );
};
