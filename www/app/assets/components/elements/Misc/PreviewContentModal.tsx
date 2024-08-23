import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    Center,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    Text,
} from "@chakra-ui/react";
import React from "react";
import { PreviewIframe } from "./PreviewIframe";
import { Header } from "@/components/Layout/Header";

type PreviewContentModalType = {
    isOpen: boolean;
    onClose: () => void;
    html: string;
    isLoading: boolean;
    setValidOff: () => void;
    setConfirmOff: () => void;
    submitRef: React.RefObject<HTMLButtonElement>;
    isEdit?: boolean;
};

export const PreviewContentModal = (props: PreviewContentModalType) => {
    const {
        isOpen,
        onClose,
        html,
        isLoading,
        setValidOff,
        setConfirmOff,
        submitRef,
        isEdit = false,
    } = props;
    return (
        <Modal
            onClose={onClose}
            size={"full"}
            isOpen={isOpen}
            scrollBehavior="outside"
        >
            <ModalOverlay />
            <ModalContent>
                {/* <ModalHeader>
                    <ModalCloseButton
                        onClick={(e) => {
                            setValidOff();
                            setConfirmOff();
                        }}
                    />
                </ModalHeader> */}
                <ModalBody m={0} p={0}>
                    <Center zIndex="99" position="sticky" top="10" height="0">
                        <Box
                            bg="whiteAlpha.800"
                            p="2"
                            w="xl"
                            border="2px"
                            borderColor="red.400"
                            textAlign="center"
                        >
                            <SimpleGrid columns={2}>
                                <Center>
                                    <Heading fontSize="2xl">内容確認</Heading>
                                </Center>
                                <ButtonGroup variant="outline" spacing="6">
                                    <Button
                                        size="lg"
                                        bg="gray.400"
                                        color={"white"}
                                        _hover={{
                                            bg: "gray.500",
                                        }}
                                        onClick={(e) => {
                                            setValidOff();
                                            setConfirmOff();
                                            onClose();
                                        }}
                                    >
                                        戻る
                                    </Button>
                                    <Button
                                        type="button"
                                        isLoading={isLoading}
                                        size="lg"
                                        bg={"blue.400"}
                                        color={"white"}
                                        _hover={{
                                            bg: "blue.500",
                                        }}
                                        onClick={(e) => {
                                            submitRef?.current?.click();
                                        }}
                                    >
                                        {isEdit ? "更新" : "登録"}
                                    </Button>
                                </ButtonGroup>
                            </SimpleGrid>
                        </Box>
                    </Center>
                    <PreviewIframe html={html} />
                </ModalBody>
                {/* <ModalFooter>

                </ModalFooter> */}
            </ModalContent>
        </Modal>
    );
};
