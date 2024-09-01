import React, { useEffect, useState } from "react";
import {
    Text,
    Stack,
    HStack,
    Skeleton,
    Table as ChakraTable,
    TableContainer,
    TableProps,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
    TableCellProps,
    TableColumnHeaderProps,
} from "@chakra-ui/react";

import { useDayWorkMeta } from "../api/getDayWorkMeta";

import { useFormContext } from "react-hook-form";

import { DayWorkFormValuesType, DayWorkType } from "../types";
import {  BaseSelectOptions } from "@/types";

import Time from "./Time";

// ブロックの情報をテーブル表示するcomponent
const TimeTable = () => {

    const { watch, setValue } = useFormContext<DayWorkFormValuesType>();

    const { data: meta } = useDayWorkMeta();

    const blocks = watch("blocks") || [];

    const getProjectName = (
        value01: string | number | undefined,
        masterProductCodes: BaseSelectOptions[]
    ) => {
        if (typeof value01 !== 'string') return '';
        const productCode = masterProductCodes.find((code) => code.id === value01);
        return productCode ? productCode.title : '';
    };

    const getWorkName = (
        value02: string | number | undefined,
        masterWorkCodes: BaseSelectOptions[]
    ) => {
        if (typeof value02 !== 'string') return '';
        const workCode = masterWorkCodes.find((code) => code.id === value02);
        return workCode ? workCode.title : '';
    };

    return (
        <Stack>
            <TableContainer
                whiteSpace="initial"
                overflowX="unset"
                overflowY="unset"
            >
                <ChakraTable>
                    <Thead
                        bg="green.400"
                        shadow="md"
                        pos="sticky"
                        top={0}
                        zIndex="docked"
                    >
                        <Tr>
                            <Th
                                px={0.5}
                                py={2}
                                fontSize="md"
                                alignItems="center"
                                color="white"
                                whiteSpace="normal"
                                textAlign="center"
                                maxW="5"
                                minW="5"
                            >
                                日報掲載
                            </Th>
                            <Th
                                px={0.5}
                                py={2}
                                fontSize="md"
                                alignItems="center"
                                color="white"
                                whiteSpace="normal"
                                textAlign="center"
                                maxW="20"
                                minW="20"
                            >
                                案件
                            </Th>
                            <Th
                                px={0.5}
                                py={2}
                                fontSize="md"
                                alignItems="center"
                                color="white"
                                whiteSpace="normal"
                                textAlign="center"
                                maxW="10"
                            >
                                作業内容
                            </Th>
                            <Th
                                px={0.5}
                                py={2}
                                fontSize="md"
                                alignItems="center"
                                color="white"
                                whiteSpace="normal"
                                textAlign="center"
                                maxW="10"
                            >
                                作業時間
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {blocks.map((block, index) =>(
                            <Tr key={index} w="100%">
                                <Td
                                    px={0.5}
                                    py={2}
                                    fontSize="md"
                                    color="gray.900"
                                    whiteSpace="normal"
                                    textAlign="center"
                                    maxW="5"
                                    minW="5"
                                >
                                   {block.value04 == 1 ? '○' : '-'}
                                </Td>
                                <Td
                                    px={0.5}
                                    py={2}
                                    fontSize="md"
                                    color="gray.900"
                                    whiteSpace="normal"
                                    textAlign="left"
                                    maxW="20"
                                    minW="20"
                                >
                                    {
                                    meta && meta.master_product_codes
                                        ? getProjectName(block.value01, meta.master_product_codes)
                                        : ''
                                    }
                                </Td>
                                <Td
                                    px={0.5}
                                    py={2}
                                    fontSize="md"
                                    color="gray.900"
                                    whiteSpace="normal"
                                    textAlign="left"
                                    maxW="10"
                                >
                                {
                                meta && meta.master_work_codes
                                    ? getWorkName(block.value02, meta.master_work_codes)
                                    : ''
                                }
                                </Td>
                                <Td
                                    px={0.5}
                                    py={2}
                                    fontSize="md"
                                    color="gray.900"
                                    whiteSpace="normal"
                                    textAlign="center"
                                    maxW="10"
                                >
                                    {block.value03}
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th>
                            </Th>
                        </Tr>
                    </Tfoot>
                </ChakraTable>
            </TableContainer>
            <Time />
        </Stack>
    );
};

export default TimeTable;
