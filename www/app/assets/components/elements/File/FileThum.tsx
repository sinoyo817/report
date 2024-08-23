import React from "react";
import {
    Box,
    Center,
    Icon,
    IconButton,
    LinkBox,
    LinkOverlay,
    Text,
} from "@chakra-ui/react";
import { GoFile } from "react-icons/go";
import { ExternalLinkIcon } from "@chakra-ui/icons";

type FileTumbProp = {
    isLink?: boolean;
    isCaption?: boolean;
    filePath: string;
    filename?: string;
    mime?: string;
};

export const FileTumb = ({
    isLink = true,
    isCaption = false,
    filePath,
    filename,
    mime,
}: FileTumbProp) => {
    return isLink ? (
        <Box display="block" w="full" minH="200px" minW="200px" p="4">
            <Center>
                <Icon as={GoFile} boxSize="full" />
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
        <Box display="block" w="full" minH="200px" minW="200px" p="4">
            <Icon as={GoFile} boxSize="full" />
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
    );
};
