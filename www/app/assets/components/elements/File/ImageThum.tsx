import React from "react";
import {
    Box,
    BoxProps,
    Center,
    IconButton,
    Image,
    ImageProps,
    Link,
    LinkBox,
    LinkOverlay,
    Skeleton,
    Stack,
    Text,
    useBoolean,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

type ImageTumbProp = {
    isLink?: boolean;
    isCaption?: boolean;
    filePath: string;
    filename?: string;
    tumbBoxProps?: BoxProps;
    tumbImageProps?: ImageProps;
};

export const ImageTumb = ({
    isLink = true,
    isCaption = false,
    filePath,
    filename,
    tumbBoxProps,
    tumbImageProps,
}: ImageTumbProp) => {
    return isLink ? (
        <Box
            display="block"
            w="full"
            minH="200px"
            minW="200px"
            p="4"
            {...tumbBoxProps}
        >
            <Center>
                <Image
                    boxSize="150px"
                    alignContent="center"
                    justifyContent="center"
                    fit="cover"
                    fallback={<Skeleton boxSize="150px" />}
                    src={filePath}
                    alt={filename || ""}
                    {...tumbImageProps}
                />
            </Center>
            {isCaption && (
                <Center>
                    <LinkBox w="150px">
                        <LinkOverlay href={filePath} isExternal>
                            {filename} <ExternalLinkIcon mx="2px" />
                        </LinkOverlay>
                    </LinkBox>
                </Center>
            )}
        </Box>
    ) : (
        <Box
            display="block"
            w="full"
            minH="200px"
            minW="200px"
            p="4"
            {...tumbBoxProps}
        >
            <Image
                boxSize="full"
                objectFit="cover"
                fallback={<Skeleton boxSize="150px" />}
                src={filePath}
                alt={filename || ""}
                loading="lazy"
                {...tumbImageProps}
            />
        </Box>
    );
};
