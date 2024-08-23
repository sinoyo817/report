import React from "react";

import { Box, Flex, Heading, Stack } from "@chakra-ui/react";

type LayoutProps = {
    children: React.ReactNode;
    title: string;
};

export const Layout = ({ children, title }: LayoutProps) => {
    return (
        <Flex
            minH={"100vh"}
            alignContent={"center"}
            justifyContent={"center"}
            bg={"gray.50"}
        >
            <Stack
                w={"full"}
                spacing={8}
                mx={"auto"}
                maxW={"lg"}
                pt={20}
                pb={20}
                px={10}
            >
                <Stack alignContent={"center"}>
                    <Heading fontSize={"3xl"} textAlign={"center"}>
                        {title}
                    </Heading>
                </Stack>
                <Box
                    rounded={"2xl"}
                    bg={"white"}
                    boxShadow={"lg"}
                    pb={20}
                    pt={10}
                    px={8}
                >
                    {children}
                </Box>
            </Stack>
        </Flex>
    );
};
