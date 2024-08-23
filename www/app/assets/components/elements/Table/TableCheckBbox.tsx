import React from "react";
import {
    Box,
    chakra,
    Checkbox,
    CheckboxProps,
    Flex,
    Input,
    InputProps,
    useCheckbox,
    UseCheckboxProps,
} from "@chakra-ui/react";
import { useRef, useEffect, HTMLProps } from "react";
import { ColumnDef, ColumnHelper } from "@tanstack/react-table";

type IndeterminateCheckboxType = Omit<
    InputProps,
    keyof HTMLProps<HTMLInputElement>
> &
    Pick<HTMLProps<HTMLInputElement>, "checked"> & {
        indeterminate?: boolean;
    };

const IndeterminateCheckbox = (props: IndeterminateCheckboxType) => {
    const { indeterminate, ...rest } = props;
    const ref = useRef<HTMLInputElement>(null!);
    // const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } =
    //     useCheckbox();

    useEffect(() => {
        if (typeof indeterminate === "boolean") {
            ref.current.indeterminate = !rest.checked && indeterminate;
        }
    }, [ref, indeterminate]);

    return <input type="checkbox" ref={ref} {...rest} />;
    // return (
    //     <chakra.label
    //         display="flex"
    //         flexDirection="row"
    //         alignItems="center"
    //         gridColumnGap={2}
    //         maxW="36"
    //         bg="green.50"
    //         border="1px solid"
    //         borderColor="green.500"
    //         rounded="lg"
    //         px={3}
    //         py={1}
    //         cursor="pointer"
    //         {...htmlProps}
    //     >
    //         <input type="checkbox" ref={ref} {...rest} hidden />
    //         <Flex
    //             alignItems="center"
    //             justifyContent="center"
    //             border="2px solid"
    //             borderColor="green.500"
    //             w={4}
    //             h={4}
    //             {...getCheckboxProps()}
    //         >
    //             {state.isChecked && <Box w={2} h={2} bg="green.500" />}
    //         </Flex>
    //     </chakra.label>
    // );
    // return <Checkbox ref={ref} inputProps={{ ...ref, ...rest }} {...rest} />;
};

export const TableCheckbox: <T>(
    columnHelper: ColumnHelper<T>
) => ColumnDef<T, unknown> = (columnHelper) =>
    columnHelper.display({
        id: "select",
        header: ({ table }) => (
            <IndeterminateCheckbox
                {...{
                    checked: table.getIsAllRowsSelected(),
                    indeterminate: table.getIsSomeRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler(),
                }}
            />
        ),
        cell: ({ row }) => (
            <Box ml={`${row.depth * 20}px`}>
                <IndeterminateCheckbox
                    {...{
                        checked: row.getIsSelected(),
                        disabled: !row.getCanSelect(),
                        // indeterminate: row.getIsSomeSelected(),
                        onChange: row.getToggleSelectedHandler(),
                    }}
                />
            </Box>
        ),
        meta: {
            thProps: {
                w: 0.5,
                p: 0.5,
            },
            tdProps: {
                w: 0.5,
                p: 0.5,
            },
        },
    });

const CustomCheckbox = (props: UseCheckboxProps) => {
    const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } =
        useCheckbox(props);

    return (
        <chakra.label
            display="flex"
            flexDirection="row"
            alignItems="center"
            gridColumnGap={2}
            maxW="36"
            bg="green.50"
            border="1px solid"
            borderColor="green.500"
            rounded="lg"
            px={3}
            py={1}
            cursor="pointer"
            {...htmlProps}
        >
            <input {...getInputProps()} hidden />
            <Flex
                alignItems="center"
                justifyContent="center"
                border="2px solid"
                borderColor="green.500"
                w={4}
                h={4}
                {...getCheckboxProps()}
            >
                {state.isChecked && <Box w={2} h={2} bg="green.500" />}
            </Flex>
        </chakra.label>
    );
};
