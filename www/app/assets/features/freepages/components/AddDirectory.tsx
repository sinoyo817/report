import { Icon, IconButton } from "@chakra-ui/react";
import React from "react";
import {
    FreepageDirectoryFormValuesType,
    FreepageDirectoryType,
    FreepageDirectoryMetaType,
} from "../types";
import { useCreateFreepageDirectory } from "../api/createFreepageDirectory";
import { AiOutlineFileAdd, AiOutlineFolderAdd } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";

export type AddDirectoryType = {
    data: FreepageDirectoryType;
    meta?: FreepageDirectoryMetaType;
};

const AddDirectory = (props: AddDirectoryType) => {
    const { data, meta } = props;

    const mutation = useCreateFreepageDirectory();

    const createDirectory = async () => {
        const values: FreepageDirectoryFormValuesType = {
            parent_id: data.id,
            type: "directory",
            title: "新規ディレクトリ",
            path: uuidv4(),
        };

        try {
            const data = await mutation.mutateAsync({
                data: values,
            });
        } catch (e) {
            //
        }
    };

    const createDocument = async () => {
        const values: FreepageDirectoryFormValuesType = {
            parent_id: data.id,
            type: "document",
            title: "新規ページ",
            path: uuidv4(),
        };

        try {
            const data = await mutation.mutateAsync({
                data: values,
            });
        } catch (e) {
            //
        }
    };

    return (
        <>
            <IconButton
                icon={<Icon as={AiOutlineFolderAdd} boxSize={6} />}
                aria-label={"階層追加"}
                onClick={createDirectory}
                boxSize={6}
                title="階層追加"
                variant="ghost"
                isLoading={mutation.isLoading}
            />
            <IconButton
                icon={<Icon as={AiOutlineFileAdd} boxSize={6} />}
                aria-label={"ページ追加"}
                onClick={createDocument}
                boxSize={6}
                title="ページ追加"
                variant="ghost"
                isLoading={mutation.isLoading}
            />
            {/* <Button onClick={onOpen} bg="cyan.800" color="white" fontSize="sm">
                階層/ページ
                <br />
                登録
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} size="4xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>階層/ページ登録</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <BaseForm<FreepageDirectoryFormValuesType>
                            onSubmit={onSubmit}
                        >
                            <DirectoryForm {...props} />
                            <HStack mt="4" w="full" justifyContent="center">
                                <ButtonGroup variant="outline" spacing="6">
                                    <Button
                                        type="button"
                                        size="lg"
                                        bg={"gray.400"}
                                        color={"white"}
                                        _hover={{
                                            bg: "blue.500",
                                        }}
                                        onClick={onClose}
                                    >
                                        閉じる
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        bg={"cyan.800"}
                                        color={"white"}
                                        _hover={{
                                            bg: "cyan.700",
                                        }}
                                        isLoading={mutation.isLoading}
                                    >
                                        登録
                                    </Button>
                                </ButtonGroup>
                            </HStack>
                        </BaseForm>
                    </ModalBody>
                </ModalContent>
            </Modal> */}
        </>
    );
};

export default AddDirectory;
