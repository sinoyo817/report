import React from "react";
import {
    Center,
    HStack,
    LinkBox,
    LinkOverlay,
    Text,
    useClipboard,
    useToast,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";

export type CopyTextCellType = {
    text: string;
};

const CopyTextCell = (props: CopyTextCellType) => {
    const { text } = props;

    const { onCopy } = useClipboard(text);

    const toast = useToast();

    const copy = () => {
        onCopy();
        toast({
            title: "コピーしました",
            status: "success",
            duration: 1000,
            isClosable: true,
        });
    };

    return (
        <Center>
            <LinkBox>
                <LinkOverlay onClick={copy} cursor={"pointer"}>
                    <HStack>
                        <Text>{text}</Text>
                        <CopyIcon />
                    </HStack>
                </LinkOverlay>
            </LinkBox>
        </Center>
    );
};

export default CopyTextCell;
