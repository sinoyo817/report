import {
    Box,
    Button,
    ButtonGroup,
    HStack,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import {
    FreepageDirectoryType,
    FreepageDirectoryMetaType,
    FreepageDirectoryFormValuesType,
} from "../types";
import { FormProvider } from "@/providers/form";
import { StatusCell } from "@/features/misc/components/StatusCell";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { BaseForm } from "@/components/Form/BaseForm";
import DirectoryForm from "./DirectoryForm";
import { useUpdateFreepageDirectory } from "../api/updateFreepageDirectory";
import { SubmitHandler, useFormContext } from "react-hook-form";
import { AxiosError } from "axios";
import { ResponseValidationType } from "@/types";

export type EditDirectoryType = {
    data: FreepageDirectoryType;
    meta?: FreepageDirectoryMetaType;
};

const EditDirectory = (props: EditDirectoryType) => {
    const { data, meta } = props;

    const { isOpen, onOpen, onClose } = useDisclosure();

    const mutation = useUpdateFreepageDirectory();

    const {
        setError,
        setValue,
        formState: { isDirty },
        reset,
    } = useFormContext();

    useEffect(() => {
        reset(data);
    }, [data]);

    const onSubmit: SubmitHandler<FreepageDirectoryFormValuesType> = async (
        values
    ) => {
        try {
            const update = await mutation.mutateAsync({
                data: values,
                id: data.id,
            });
            onClose();
        } catch (e) {
            if (e instanceof AxiosError) {
                if (e.response?.status === 422) {
                    const errorMessages: ResponseValidationType =
                        e.response.data.error;

                    for (const [key, value] of Object.entries(errorMessages)) {
                        setError(key, { types: value });
                    }
                    // console.log(errorMessages);
                }
            }
        }
    };

    return (
        <>
            <IconButton
                icon={<EditIcon boxSize={4} />}
                aria-label="階層編集"
                onClick={onOpen}
                boxSize={6}
                title="階層編集"
                variant="ghost"
            >
                階層編集
            </IconButton>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {data.type === "directory" ? "階層" : "ページ"}編集
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <BaseForm<FreepageDirectoryFormValuesType>
                            onSubmit={onSubmit}
                        >
                            <DirectoryForm {...props} isEdit={true} />
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
                                        更新
                                    </Button>
                                </ButtonGroup>
                            </HStack>
                        </BaseForm>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default EditDirectory;
