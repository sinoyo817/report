import React from "react";
import {
    FormControl,
    FormLabel,
    Select,
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
    HStack,
} from "@chakra-ui/react";
import { flexRender, Table as ReactTable } from "@tanstack/react-table";
import { getSelectedTableIds } from "@/utils/getSelectedTableIds";
import { BaseEntityType, ResoponseCollectionType } from "@/types";
import { BulkStatus } from "../BulkStatus";
import { Pagination } from "../Misc/Pagination";

import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
    OnDragEndResponder,
} from "@hello-pangea/dnd";
import { DragHandleIcon } from "@chakra-ui/icons";

export type PaginationTableProps<TData extends BaseEntityType> = {
    table: ReactTable<TData>;
    isApproval?: boolean;
    collection?: ResoponseCollectionType;
    setPagination: React.Dispatch<React.SetStateAction<number>>;
    pageNumber: number;
    isLoading: boolean;
    statusKey?: string;
    pageLimit: number;
    setPageLimit: React.Dispatch<React.SetStateAction<number>>;
    onDragEnd: OnDragEndResponder;
} & TableProps;

export const DndTable = <TData extends BaseEntityType & { sequence: number }>(
    props: PaginationTableProps<TData>
) => {
    const {
        table,
        isApproval = true,
        collection,
        setPagination,
        pageNumber,
        isLoading,
        statusKey,
        pageLimit,
        setPageLimit,
        onDragEnd,
        ...tableProps
    } = props;

    const showPagination = (collection && collection.pages > 1) || false;

    return (
        <>
            <HStack w="full" my="3" spacing="4">
                {isApproval && (
                    <BulkStatus
                        ids={getSelectedTableIds({ table: table })}
                        resetRowSelection={table.resetRowSelection}
                        statusKey={statusKey}
                    />
                )}
                <HStack w="full" justifyContent="right"></HStack>
                {collection && showPagination && (
                    <Pagination
                        collection={collection}
                        setPagination={setPagination}
                        pageNumber={pageNumber}
                    />
                )}
            </HStack>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable-id" direction="vertical">
                    {(provided, snapshot) => (
                        <Skeleton isLoaded={!isLoading}>
                            <TableContainer
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <ChakraTable variant="striped" {...tableProps}>
                                    <Thead
                                        bg="black"
                                        shadow="md"
                                        pos="sticky"
                                        top={0}
                                        zIndex="docked"
                                    >
                                        {table
                                            .getHeaderGroups()
                                            .map((headerGroup) => (
                                                <Tr key={headerGroup.id}>
                                                    <Th
                                                        key="header-dnd"
                                                        mr={1}
                                                        fontSize="md"
                                                        alignItems="center"
                                                        color="white"
                                                        whiteSpace="normal"
                                                        textAlign="center"
                                                        w="32"
                                                    >
                                                        並び替え
                                                    </Th>
                                                    {headerGroup.headers.map(
                                                        (header) => (
                                                            <Th
                                                                key={header.id}
                                                                px={0.5}
                                                                fontSize="md"
                                                                alignItems="center"
                                                                color="white"
                                                                whiteSpace="normal"
                                                                textAlign="center"
                                                                maxW="10"
                                                            >
                                                                {header.isPlaceholder
                                                                    ? null
                                                                    : flexRender(
                                                                          header
                                                                              .column
                                                                              .columnDef
                                                                              .header,
                                                                          header.getContext()
                                                                      )}
                                                            </Th>
                                                        )
                                                    )}
                                                </Tr>
                                            ))}
                                    </Thead>
                                    <Tbody>
                                        {table
                                            .getRowModel()
                                            .rows.map((row, idx) => (
                                                <Draggable
                                                    draggableId={
                                                        row.original.id
                                                    }
                                                    index={
                                                        row.original.sequence ||
                                                        idx
                                                    }
                                                    key={row.original.id}
                                                >
                                                    {(provided, snapshot) => (
                                                        <Tr
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            w="100%"
                                                            display={
                                                                snapshot.isDragging
                                                                    ? "table"
                                                                    : ""
                                                            }
                                                            {...provided.draggableProps}
                                                        >
                                                            <Td
                                                                py="4"
                                                                display={
                                                                    snapshot.isDragging
                                                                        ? "table"
                                                                        : ""
                                                                }
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <DragHandleIcon />
                                                            </Td>
                                                            {row
                                                                .getVisibleCells()
                                                                .map((cell) => {
                                                                    const {
                                                                        rowSpan,
                                                                        ...tdProps
                                                                    } =
                                                                        cell
                                                                            .column
                                                                            .columnDef
                                                                            .meta
                                                                            ?.tdProps ||
                                                                        {};

                                                                    const isExpanded =
                                                                        row.getIsExpanded();

                                                                    if (
                                                                        cell.row
                                                                            .parentId &&
                                                                        rowSpan &&
                                                                        rowSpan >
                                                                            1
                                                                    ) {
                                                                        if (
                                                                            cell.row.getParentRow()
                                                                                ?.getIsExpanded
                                                                        ) {
                                                                            return null;
                                                                        }
                                                                    }

                                                                    return (
                                                                        <Td
                                                                            key={
                                                                                cell.id
                                                                            }
                                                                            // px="6"
                                                                            // py="4"
                                                                            px={
                                                                                0.5
                                                                            }
                                                                            fontSize="md"
                                                                            color="gray.900"
                                                                            whiteSpace="normal"
                                                                            textAlign="center"
                                                                            maxW="10"
                                                                            rowSpan={
                                                                                isExpanded
                                                                                    ? rowSpan
                                                                                    : undefined
                                                                            }
                                                                            {...tdProps}
                                                                        >
                                                                            {flexRender(
                                                                                cell
                                                                                    .column
                                                                                    .columnDef
                                                                                    .cell,
                                                                                cell.getContext()
                                                                            )}
                                                                        </Td>
                                                                    );
                                                                })}
                                                        </Tr>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </Tbody>
                                    <Tfoot>
                                        {table
                                            .getFooterGroups()
                                            .map((footerGroup) => (
                                                <Tr key={footerGroup.id}>
                                                    {footerGroup.headers.map(
                                                        (header) => (
                                                            <Th key={header.id}>
                                                                {header.isPlaceholder
                                                                    ? null
                                                                    : flexRender(
                                                                          header
                                                                              .column
                                                                              .columnDef
                                                                              .footer,
                                                                          header.getContext()
                                                                      )}
                                                            </Th>
                                                        )
                                                    )}
                                                </Tr>
                                            ))}
                                    </Tfoot>
                                </ChakraTable>
                            </TableContainer>
                        </Skeleton>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    );
};
