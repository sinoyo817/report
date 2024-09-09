import React from "react";
import {
    Button,
    ButtonGroup,
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
    Link,
} from "@chakra-ui/react";
import {
    flexRender,
    Table as ReactTable,
    RowData,
} from "@tanstack/react-table";
import { getSelectedTableIds } from "@/utils/getSelectedTableIds";
import { BaseEntityType, ResoponseCollectionType } from "@/types";
import { BulkStatus } from "../BulkStatus";
import { Pagination } from "../Misc/Pagination";

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData extends RowData, TValue> {
        tdProps?: TableCellProps;
        thProps?: TableColumnHeaderProps;
    }
}

export type PaginationTableProps<TData extends BaseEntityType> = {
    table: ReactTable<TData>;
    isApproval?: boolean;
    collection?: ResoponseCollectionType;
    setPagination: React.Dispatch<React.SetStateAction<number>>;
    pageNumber: number;
    isLoading: boolean;
    statusKey?: string;
    isCsvDownload?: boolean;
    isCsvUpload?: boolean;
    csvDownloadLink?: string;
    csvAllDownloadLink?: string;
    csvDownloadOnClick?: React.MouseEventHandler<HTMLButtonElement>;
    csvUploadOnClick?: React.MouseEventHandler<HTMLButtonElement>;
} & TableProps;

export const PaginationTable = <TData extends BaseEntityType>(
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
        isCsvDownload = false,
        isCsvUpload = false,
        csvDownloadLink,
        csvAllDownloadLink,
        csvDownloadOnClick,
        csvUploadOnClick,
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

                <HStack w="full" justifyContent="right">
                    <ButtonGroup>
                        {isCsvUpload && (
                            <Button bg="green.100" onClick={csvUploadOnClick}>
                                CSV取り込み
                            </Button>
                        )}
                        {isCsvDownload && csvDownloadOnClick && (
                            <Button bg="pink.600" onClick={csvDownloadOnClick}>
                                CSV出力
                            </Button>
                        )}
                        {isCsvDownload && csvDownloadLink && (
                            <Button
                                as={Link}
                                bg="pink.600"
                                color="white"
                                target={"_blank"}
                                href={csvDownloadLink}
                            >
                                CSV出力
                            </Button>
                        )}
                        {isCsvDownload && csvAllDownloadLink && (
                            <Button
                                as={Link}
                                bg="orange.400"
                                color="white"
                                target={"_blank"}
                                href={csvAllDownloadLink}
                            >
                                日別CSV出力
                            </Button>
                        )}
                    </ButtonGroup>
                </HStack>
            </HStack>
            {collection && showPagination && (
                <Pagination
                    collection={collection}
                    setPagination={setPagination}
                    pageNumber={pageNumber}
                />
            )}

            <Skeleton isLoaded={!isLoading}>
                <TableContainer
                    whiteSpace="initial"
                    overflowX="unset"
                    overflowY="unset"
                >
                    <ChakraTable variant="striped" {...tableProps}>
                        <Thead
                            bg="black"
                            shadow="md"
                            pos="sticky"
                            top={0}
                            zIndex="docked"
                        >
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <Th
                                            key={header.id}
                                            // px={1}
                                            // py={3}
                                            px={0.5}
                                            fontSize="md"
                                            alignItems="center"
                                            color="white"
                                            whiteSpace="normal"
                                            textAlign="center"
                                            // maxW="10"
                                            maxW={header.column.columnDef.id === 'title' ? '100' : '10'}
                                            {...header.column.columnDef.meta
                                                ?.thProps}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </Th>
                                    ))}
                                </Tr>
                            ))}
                        </Thead>
                        <Tbody>
                            {table.getRowModel().rows.map((row) => (
                                <Tr key={row.id} w="100%">
                                    {row.getVisibleCells().map((cell) => {
                                        const { rowSpan, ...tdProps } =
                                            cell.column.columnDef.meta
                                                ?.tdProps || {};

                                        const isExpanded = row.getIsExpanded();

                                        if (
                                            cell.row.parentId &&
                                            rowSpan &&
                                            rowSpan > 1
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
                                                key={cell.id}
                                                // px="6"
                                                // py="4"
                                                px={0.5}
                                                fontSize="md"
                                                color="gray.900"
                                                whiteSpace="normal"
                                                textAlign="center"
                                                // maxW="10"
                                                maxW={cell.column.columnDef.id === 'title' ? '100' : '10'}
                                                rowSpan={
                                                    isExpanded
                                                        ? rowSpan
                                                        : undefined
                                                }
                                                {...tdProps}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </Td>
                                        );
                                    })}
                                </Tr>
                            ))}
                        </Tbody>
                        <Tfoot>
                            {table.getFooterGroups().map((footerGroup) => (
                                <Tr key={footerGroup.id}>
                                    {footerGroup.headers.map((header) => (
                                        <Th key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.footer,
                                                    header.getContext()
                                                )}
                                        </Th>
                                    ))}
                                </Tr>
                            ))}
                        </Tfoot>
                    </ChakraTable>
                </TableContainer>
            </Skeleton>

            {collection && showPagination && (
                <Pagination
                    collection={collection}
                    setPagination={setPagination}
                    pageNumber={pageNumber}
                />
            )}
        </>
    );
};
