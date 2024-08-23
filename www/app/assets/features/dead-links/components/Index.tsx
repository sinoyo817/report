import React, { useEffect } from "react";
import { PaginationTable } from "@/components/elements/Table";
import { Box, HStack, Link, Text } from "@chakra-ui/react";
import {
    ColumnDef,
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { useDeadLinks } from "../api/getDeadLinks";
import { DeadLinkType, DeadLinkFilterParamType } from "../types";

import { adminPrefix } from "@/config";
import { useDeadLinkMeta } from "../api/getDeadLinkMeta";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { FormProvider } from "@/providers/form";
import Search from "./Search";
import { useAuth } from "@/lib/auth";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";

const Index = () => {
    const { getContentsFilter, pageNumber, setPagination } = useFilterParams();

    const { data, isLoading } = useDeadLinks({
        filters: getContentsFilter(),
    });

    const { data: meta } = useDeadLinkMeta();

    const [rowSelection, setRowSelection] = useState({});

    const columnHelper = createColumnHelper<DeadLinkType>();

    const columns = useMemo<ColumnDef<DeadLinkType>[]>(
        () => [
            columnHelper.accessor("title", {
                id: "title",
                cell: (info) => (
                    <Link
                        as={RouterLink}
                        to={`${adminPrefix}${info.row.original.target_admin_url}`}
                        color="teal.400"
                    >
                        {info.row.original?.sub_title ? (
                            <>
                                {info.row.original.sub_title}
                                <br />
                                {info.getValue()}
                            </>
                        ) : (
                            info.getValue()
                        )}
                    </Link>
                ),
                header: () => <span>リンク切れがあるページタイトル</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<DeadLinkType>,
            columnHelper.accessor("url", {
                id: "url",
                cell: (info) => (
                    <Link href={info.getValue()} color="teal.400" isExternal>
                        {info.getValue()}
                        <ExternalLinkIcon mx="2px" />
                    </Link>
                ),
                header: () => <span>リンク切れがあるページのURL</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<DeadLinkType>,
            columnHelper.accessor("target_url", {
                id: "target_url",
                cell: (info) => {
                    const format = info.getValue().split(",");

                    return format.map((i, idx) => (
                        <Box key={`url-${idx}`}>
                            <Link href={i} color="teal.400" isExternal>
                                {i}
                                <ExternalLinkIcon mx="2px" />
                            </Link>
                        </Box>
                    ));
                },
                header: () => <span>リンクが切れているURL</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<DeadLinkType>,
        ],
        [data]
    );

    useEffect(() => {
        setRowSelection({});
    }, [pageNumber]);

    const table = useReactTable({
        data: data?.data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            rowSelection,
        },
        onRowSelectionChange: setRowSelection,
        manualPagination: true,
        getFilteredRowModel: getFilteredRowModel(),
    });

    const collection = data?.collection;

    return (
        <Box>
            <FormProvider>
                <Search />
            </FormProvider>

            <HStack w="full" my="3" spacing="4" justifyContent="right">
                {meta?.exec?.start && <Text>実行日時 {meta.exec.start}</Text>}
            </HStack>
            <PaginationTable
                table={table}
                collection={collection}
                setPagination={setPagination}
                pageNumber={pageNumber}
                isLoading={isLoading}
                isApproval={false}
            />
        </Box>
    );
};

export default Index;
