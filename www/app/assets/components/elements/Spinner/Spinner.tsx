import React from "react";
import { Box } from "@chakra-ui/react";
import { Spinner as ChakraSpinner, SpinnerProps } from "@chakra-ui/spinner";

export const LoadingSpinner = (props: SpinnerProps) => {
    return (
        <Box
            w="full"
            display="flex"
            justifyContent="center"
            alignContent="center"
        >
            <ChakraSpinner
                size="xl"
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                {...props}
            />
        </Box>
    );
};
