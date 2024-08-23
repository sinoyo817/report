import React, { useEffect } from "react";
import {
    Box,
    Button,
    Center,
    CloseButton,
    Flex,
    FormControl,
    FormErrorMessage,
    Heading,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    ListItem,
    UnorderedList,
} from "@chakra-ui/react";

import {
    ArrayPath,
    FieldValues,
    useController,
    useFieldArray,
} from "react-hook-form";

import {
    SimpleBlockEntityType,
    CommonFieldOptionType,
    FormFieldType,
} from "@/types";
import { DragHandleIcon } from "@chakra-ui/icons";

import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "@hello-pangea/dnd";

type BaseSimpleBlockFieldProps<T extends FieldValues> = FormFieldType<T> &
    CommonFieldOptionType;

export const BaseSimpleBlockField = <T extends FieldValues>(
    props: BaseSimpleBlockFieldProps<T>
) => {
    const { id, label, isConfirm, blockLimit = 100 } = props;

    // const { watch } = useFormContext();

    const { fields, move, append, remove, ...actions } = useFieldArray<
        SimpleBlockEntityType,
        ArrayPath<SimpleBlockEntityType>,
        keyof SimpleBlockEntityType
    >({
        name: id as never,
    });

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
                    <UnorderedList>
                        {fields.map((field, index) => (
                            <ListItem key={field.id}>
                                <BlockItem
                                    isConfirm={isConfirm}
                                    id={id}
                                    index={index}
                                    field={field}
                                />
                            </ListItem>
                        ))}
                    </UnorderedList>
                </Box>
            </>
        );
    }

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
                                    <BlockItem<SimpleBlockEntityType>
                                        key={field.id}
                                        id={id}
                                        index={index}
                                        field={field}
                                        remove={remove}
                                    />
                                ))}
                                {provided.placeholder}
                            </Box>
                        )}
                    </Droppable>
                </DragDropContext>

                {blockLimit > fields.length && (
                    <Center my="4">
                        <Button
                            onClick={() => append({ title: "" })}
                            variant={"solid"}
                            bg={"teal.100"}
                            rounded="2xl"
                            boxShadow="md"
                        >
                            追加
                        </Button>
                    </Center>
                )}
            </Box>
        </>
    );
};

type BlockItemTypes<S extends SimpleBlockEntityType> = {
    id: string;
    index: number;
    field: Record<keyof S, string>;
    remove?: (index: number | number[] | undefined) => void;
    isConfirm?: boolean;
};

const BlockItem = <S extends SimpleBlockEntityType>(
    props: BlockItemTypes<S>
) => {
    const { id, index, field, remove, isConfirm } = props;

    const { field: titleField, fieldState: titleFieldState } = useController({
        name: `${id}.${index}.title`,
        defaultValue: "",
        rules: { required: "入力してください" },
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

    useEffect(() => {
        sequenceField.onChange(index);
    }, [index, sequenceField]);

    if (isConfirm) {
        return titleField.value;
    }

    return (
        <Draggable draggableId={"draggable-" + field.id} index={index}>
            {(provided, snapshot) => (
                <FormControl
                    isInvalid={titleFieldState.error !== undefined}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    bg={snapshot.isDragging ? "teal.200" : "inherit"}
                >
                    <InputGroup>
                        <InputLeftElement>
                            <Box {...provided.dragHandleProps}>
                                <DragHandleIcon />
                            </Box>
                        </InputLeftElement>
                        <Input
                            type="text"
                            placeholder={"入力してください"}
                            onChange={titleField.onChange}
                            name={titleField.name}
                            value={titleField.value}
                            onBlur={titleField.onBlur}
                            ref={titleField.ref}
                        />
                        <InputRightElement>
                            <Box>
                                {remove && (
                                    <CloseButton
                                        onClick={() => remove(index)}
                                    />
                                )}
                            </Box>
                        </InputRightElement>
                    </InputGroup>

                    {titleFieldState?.error?.message && (
                        <FormErrorMessage>
                            {titleFieldState.error.message}
                        </FormErrorMessage>
                    )}

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
                </FormControl>
            )}
        </Draggable>
    );
};
