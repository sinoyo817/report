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
    Path,
    useController,
    useFieldArray,
    useFormContext,
    useWatch,
} from "react-hook-form";

import {
    BaseBlockEntityType,
    BlockFieldsType,
    CommonFieldOptionType,
    FormFieldType,
} from "@/types";
import { blockFields, cakeTranslateInputPrefix } from "@/config";
import { useCallback, useEffect, useRef } from "react";
import { SelectBlockField } from "./SelectBlockField";

import { getBaseFormFieldName } from "@/utils/getBaseFormFieldName";

type BaseForeignBlockFieldProps<T extends FieldValues> = FormFieldType<T> &
    CommonFieldOptionType;

export const BaseForeignBlockField = <T extends FieldValues>(
    props: BaseForeignBlockFieldProps<T>
) => {
    const { id, label, blockModel, isConfirm, model, locale, ...fieldProps } =
        props;

    const fieldName = getBaseFormFieldName({
        field: `${id}`,
        isForeign: true,
    }) as Path<T>;

    const baseFields: Record<keyof BaseBlockEntityType, string>[] | undefined =
        useWatch({ name: fieldName });

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
                        {baseFields &&
                            baseFields.length > 0 &&
                            baseFields.map((field, index) => (
                                <BlockItem<BaseBlockEntityType>
                                    key={`${field.id}`}
                                    id={id}
                                    index={index}
                                    isConfirm={isConfirm}
                                    locale={locale}
                                    field={field}
                                >
                                    <SelectBlockField<BaseBlockEntityType>
                                        id={id}
                                        index={index}
                                        field={field}
                                        isConfirm={isConfirm}
                                        model={model}
                                        locale={locale}
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
                    {baseFields &&
                        baseFields.length > 0 &&
                        baseFields.map((field, index) => (
                            <BlockItem<BaseBlockEntityType>
                                key={`${field.id}`}
                                id={id}
                                index={index}
                                isConfirm={isConfirm}
                                locale={locale}
                                field={field}
                            >
                                <SelectBlockField<BaseBlockEntityType>
                                    id={id}
                                    index={index}
                                    field={field}
                                    isConfirm={isConfirm}
                                    model={model}
                                    locale={locale}
                                    {...fieldProps}
                                />
                            </BlockItem>
                        ))}
                </Box>
            </Box>
        </>
    );
};

type BlockItemTypes<S extends BaseBlockEntityType> = {
    id: string;
    children: React.ReactNode;
    index: number;
    isConfirm?: boolean;
    locale?: string;
    field: Record<keyof BaseBlockEntityType, string>;
};

const BlockItem = <S extends BaseBlockEntityType>(props: BlockItemTypes<S>) => {
    const { id, children, index, isConfirm, locale, field } = props;

    const idId = `${id}.${index}.id`;

    const { field: idField } = useController({
        name: idId,
        defaultValue: field.id,
        // rules: rule,
    });

    const sequenceId = `${id}.${index}.sequence`;
    const { field: sequenceField } = useController({
        name: sequenceId,
        defaultValue: field.sequence,
        // rules: rule,
    });

    const modelId = `${id}.${index}.model`;
    const { field: modelField } = useController({
        name: modelId,
        defaultValue: field.model,
        // rules: rule,
    });

    const typeId = `${id}.${index}.type`;
    const { field: typeField } = useController({
        name: typeId,
        defaultValue: field.type,
        // rules: rule,
    });

    const foreignIdId = `${id}.${index}.foreign_id`;
    const { field: foreignIdField } = useController({
        name: foreignIdId,
        defaultValue: field.foreign_id,
        // rules: rule,
    });

    const localeId = `${id}.${index}.locale`;
    const { field: localeField } = useController({
        name: localeId,
        defaultValue: locale,
        // rules: rule,
    });

    useEffect(() => {
        if (field) {
            idField.onChange(field.id);
            sequenceField.onChange(field.sequence);
            modelField.onChange(field.model);
            typeField.onChange(field.type);
            foreignIdField.onChange(field.foreign_id);
        }
    }, [field]);

    useEffect(() => {
        if (locale) {
            localeField.onChange(locale);
        }
    }, [locale]);

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
        <Box
            display="block"
            boxSize="full"
            rounded="2xl"
            p="5"
            my="5"
            borderWidth="1px"
        >
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
            <Input
                type="hidden"
                name={foreignIdField.name}
                value={foreignIdField.value}
                onBlur={foreignIdField.onBlur}
                ref={foreignIdField.ref}
            />
            <Input
                type="hidden"
                name={localeField.name}
                value={localeField.value}
                onBlur={localeField.onBlur}
                ref={localeField.ref}
            />
        </Box>
    );
};
