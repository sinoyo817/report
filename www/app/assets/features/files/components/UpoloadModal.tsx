import React from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";

import UploadFile from "./Upload";
import { FilePondOptions } from "filepond";

type UploadModalProps = {
    model: string;
} & FilePondOptions;

export const UploadModal = (props: UploadModalProps) => {
    const { model, ...filePondProps } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Button onClick={onOpen}>ファイルアップロード</Button>

            <Modal isOpen={isOpen} onClose={onClose} size={"full"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>ファイルアップロード</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <UploadFile model={model} {...filePondProps} />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            閉じる
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
