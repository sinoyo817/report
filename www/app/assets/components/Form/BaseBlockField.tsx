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
import { SelectBlockField } from "./SelectBlockField";
import { DragHandleIcon } from "@chakra-ui/icons";

import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "@hello-pangea/dnd";

type BaseBlockFieldProps<T extends FieldValues> = FormFieldType<T> &
    CommonFieldOptionType;

export const BaseBlockField = <T extends FieldValues>(
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
        ...fieldProps
    } = props;

    // const { watch } = useFormContext();

    const { fields, move, append, remove, ...actions } = useFieldArray<
        BaseBlockEntityType,
        ArrayPath<BaseBlockEntityType>,
        keyof BaseBlockEntityType
    >({
        name: id as never,
    });

    const buttons = blockFields[blockType] || blockFields.default;

    const onDragEnd = (result: DropResult) => {
        const sourceId = result.source.droppableId;
        const destId = result.destination?.droppableId;
        if (sourceId === destId) {
            const sourceIndex = result.source.index;
            const destIndex = result.destination?.index;
            if (destIndex !== undefined) {
                if (sourceIndex !== destIndex) {
                    move(sourceIndex, destIndex);
                }
            }
        }
    };

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
                                buttons={buttons}
                            >
                                <SelectBlockField<BaseBlockEntityType>
                                    id={id}
                                    index={index}
                                    field={field}
                                    isConfirm={isConfirm}
                                    model={model}
                                    {...fieldProps}
                                />
                            </BlockItem>
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
            <Box my={"5"} display="block">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable-id" direction="vertical">
                        {(provided, snapshot) => (
                            <Box
                                ref={provided.innerRef}
                                bg={
                                    snapshot.isDraggingOver
                                        ? "green.100"
                                        : "white"
                                }
                                {...provided.droppableProps}
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
                                        buttons={buttons}
                                    >
                                        <SelectBlockField<BaseBlockEntityType>
                                            id={id}
                                            index={index}
                                            field={field}
                                            isConfirm={isConfirm}
                                            model={model}
                                            {...fieldProps}
                                        />
                                    </BlockItem>
                                ))}
                                {provided.placeholder}
                            </Box>
                        )}
                    </Droppable>
                </DragDropContext>

                <Wrap spacing={4} p={4}>
                    {blockLimit > fields.length &&
                        buttons.map((button, index) => (
                            <WrapItem key={button.defaultValues.type}>
                                <Button
                                    onClick={() => append(button.defaultValues)}
                                    variant={"solid"}
                                    bg={"cyan.800"}
                                    color={"white"}
                                    rounded="2xl"
                                    boxShadow="md"
                                    _hover={{
                                        bg: "cyan.700",
                                    }}
                                >
                                    {button.title}
                                </Button>
                            </WrapItem>
                        ))}
                </Wrap>
            </Box>
        </>
    );
};

type BlockItemTypes<S extends BaseBlockEntityType> = {
    id: string;
    children: React.ReactNode;
    index: number;
    field: Record<keyof S, string>;
    blockModel?: string;
    remove: (index: number | number[] | undefined) => void;
    isConfirm?: boolean;
    buttons: typeof blockFields.default;
};

const BlockItem = <S extends BaseBlockEntityType>(props: BlockItemTypes<S>) => {
    const {
        id,
        children,
        index,
        field,
        blockModel,
        remove,
        isConfirm,
        buttons,
    } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef(null!);

    const button = buttons.find((item) => {
        if (item.defaultValues.type === field.type) {
            return item.title;
        }
    });

    const { field: idField } = useController({
        name: `${id}.${index}.id`,
        defaultValue: field.id,
        // rules: rule,
    });
    const { field: sequenceField } = useController({
        name: `${id}.${index}.sequence`,
        defaultValue: index,
        // rules: rule,
    });
    const { field: modelField } = useController({
        name: `${id}.${index}.model`,
        defaultValue: blockModel,
        // rules: rule,
    });
    const { field: typeField } = useController({
        name: `${id}.${index}.type`,
        defaultValue: field.type,
        // rules: rule,
    });

    useEffect(() => {
        sequenceField.onChange(index);
    }, [index]);

    useEffect(() => {
        if (field) {
            if (!idField.value) {
                idField.onChange(field.id);
            }
            typeField.onChange(field.type);
        }
    }, [field]);
    useEffect(() => {
        if (blockModel) {
            modelField.onChange(blockModel);
        }
    }, [blockModel]);

    if (isConfirm) {
        return (
            <Box
                display="block"
                boxSize="full"
                rounded="2xl"
                p="5"
                my="5"
                borderWidth="1px"
            >
                {children}
            </Box>
        );
    }

    return (
        <Draggable draggableId={"draggable-" + field.id} index={index}>
            {(provided, snapshot) => (
                <Box
                    display="block"
                    boxSize="full"
                    boxShadow="md"
                    rounded="2xl"
                    p="5"
                    my="5"
                    borderWidth="1px"
                >
                    <Flex
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        bg={snapshot.isDragging ? "teal.200" : "inherit"}
                    >
                        <Box {...provided.dragHandleProps}>
                            <DragHandleIcon />
                        </Box>
                        <Spacer />
                        {button && (
                            <Heading fontSize="3xl" color="cyan.800">
                                {button.title}
                            </Heading>
                        )}
                        <Spacer />
                        <Box
                            p="4"
                            onClick={onOpen}
                            as={CloseButton}
                            size="lg"
                        ></Box>
                    </Flex>

                    {children}
                    <Input
                        type="hidden"
                        name={idField.name}
                        value={idField.value}
                        onBlur={idField.onBlur}
                        ref={idField.ref}
                    />
                    <Input
                        type="hidden"
                        name={sequenceField.name}
                        value={sequenceField.value}
                        onBlur={sequenceField.onBlur}
                        ref={sequenceField.ref}
                    />
                    <Input
                        type="hidden"
                        name={modelField.name}
                        value={modelField.value}
                        onBlur={modelField.onBlur}
                        ref={modelField.ref}
                    />
                    <Input
                        type="hidden"
                        name={typeField.name}
                        value={typeField.value}
                        onBlur={typeField.onBlur}
                        ref={typeField.ref}
                    />

                    <AlertDialog
                        isOpen={isOpen}
                        leastDestructiveRef={cancelRef}
                        onClose={onClose}
                    >
                        <AlertDialogOverlay>
                            <AlertDialogContent>
                                <AlertDialogHeader
                                    fontSize="lg"
                                    fontWeight="bold"
                                >
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
            )}
        </Draggable>
    );
};
