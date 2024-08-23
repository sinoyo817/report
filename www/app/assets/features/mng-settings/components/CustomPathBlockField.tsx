import React from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    ButtonGroup,
    Center,
    CloseButton,
    Flex,
    Heading,
    IconButton,
    Input,
    Spacer,
    useDisclosure,
    Wrap,
    WrapItem,
} from "@chakra-ui/react";

import {
    ArrayPath,
    FieldValues,
    useController,
    useFieldArray,
} from "react-hook-form";

import {
    BaseBlockEntityType,
    BlockFieldsType,
    CommonFieldOptionType,
    FormFieldType,
} from "@/types";
import { blockFields } from "@/config";
import { useCallback, useEffect, useRef } from "react";
import { DragHandleIcon } from "@chakra-ui/icons";

import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "@hello-pangea/dnd";
import { BaseInputField } from "@/components/Form/BaseInputField";

type BaseBlockFieldProps<T extends FieldValues> = FormFieldType<T> &
    CommonFieldOptionType;

export const CustomPathBlockField = <T extends FieldValues>(
    props: BaseBlockFieldProps<T>
) => {
    const {
        id,
        label,
        blockType = "default",
        blockModel,
        isConfirm,
        model,
        blockLimit = 100,
    } = props;

    // const { watch } = useFormContext();

    const { fields, move, append, remove, ...actions } = useFieldArray<
        BaseBlockEntityType,
        ArrayPath<BaseBlockEntityType>,
        keyof BaseBlockEntityType
    >({
        name: id as never,
    });

    if (isConfirm) {
        return (
            <>
                <Center
                    bg="cyan.100"
                    h="30px"
                    p="3"
                    rounded="2xl"
                    justifyContent="center"
                    alignItems="center"
                    display="inline-flex"
                    mt="3"
                >
                    <Heading as="h6" size="md">
                        {label}
                    </Heading>
                </Center>
                <Box my={"5"} display="block">
                    <Box>
                        {fields.map((field, index) => (
                            <BlockItem<BaseBlockEntityType>
                                key={field.id}
                                id={id}
                                index={index}
                                field={field}
                                blockModel={blockModel}
                                remove={remove}
                                isConfirm={isConfirm}
                            />
                        ))}
                    </Box>
                </Box>
            </>
        );
    }

    return (
        <>
            <Center
                bg="black"
                h="50px"
                p="3"
                justifyContent="left"
                alignItems="center"
                display="inline-flex"
                mt="3"
            >
                <Heading as="h6" size="md" color="white">
                    {label}
                </Heading>
            </Center>
            <Box my={"5"} display="block" color="cyan.800">
                <Box
                    // color={"cyan.800"}
                    bg={"white"}
                >
                    {fields.map((field, index) => (
                        <BlockItem<BaseBlockEntityType>
                            key={field.id}
                            id={id}
                            index={index}
                            field={field}
                            blockModel={blockModel}
                            remove={remove}
                            isConfirm={isConfirm}
                        />
                    ))}
                </Box>

                <Wrap spacing={4}>
                    {blockLimit > fields.length && (
                        <WrapItem>
                            <Button
                                onClick={() =>
                                    append({
                                        dir: "",
                                        path: "",
                                    })
                                }
                                variant={"solid"}
                                bg={"cyan.800"}
                                color={"white"}
                                rounded="2xl"
                                boxShadow="md"
                                _hover={{
                                    bg: "cyan.700",
                                }}
                            >
                                追加
                            </Button>
                        </WrapItem>
                    )}
                </Wrap>
            </Box>
        </>
    );
};

type BlockItemTypes<S extends BaseBlockEntityType> = {
    id: string;
    index: number;
    field: Record<keyof S, string>;
    blockModel?: string;
    remove: (index: number | number[] | undefined) => void;
    isConfirm?: boolean;
};

const BlockItem = <S extends BaseBlockEntityType>(props: BlockItemTypes<S>) => {
    const { id, index, field, blockModel, remove, isConfirm } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef(null!);

    if (isConfirm) {
        return (
            <Box
                display="block"
                boxSize="full"
                rounded="2xl"
                p="5"
                my="5"
                borderWidth="1px"
            />
        );
    }

    return (
        <Box
            display="block"
            boxSize="full"
            boxShadow="md"
            rounded="2xl"
            p="5"
            my="5"
            borderWidth="1px"
        >
            <Flex>
                <Box></Box>
                <Spacer />
                <Heading fontSize="3xl">カスタムファイル</Heading>

                <Spacer />
                <Box p="4" onClick={onOpen} as={CloseButton} size="lg"></Box>
            </Flex>

            <Box color="black">
                <BaseInputField
                    id={`${id}.${index}.dir`}
                    formType={"input"}
                    label="ディレクトリ名"
                    model={"Settings"}
                />
                <BaseInputField
                    id={`${id}.${index}.path`}
                    formType={"input"}
                    label="パス"
                    model={"Settings"}
                />
            </Box>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            操作
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            ブロックを削除します。よろしいですか？
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                キャンセル
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={(e) => {
                                    onClose();
                                    remove(index);
                                }}
                                ml={3}
                            >
                                削除
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};
