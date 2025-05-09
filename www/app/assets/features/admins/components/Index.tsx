import React, { useEffect } from "react";
import { PaginationTable, TableCheckbox } from "@/components/elements/Table";
import { Box, Button } from "@chakra-ui/react";
import {
    ColumnDef,
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { useAdmins } from "../api/getAdmins";
import { AdminType, AdminFilterParamType } from "../types";
import { StatusCell } from "@/features/misc/components/StatusCell";
import { FormProvider } from "@/providers/form";
import Search from "./Search";
import RoleCell from "./RoleCell";
import { CrudLinkCell } from "@/features/misc/components/CrudLinkCell";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";

const Index = () => {
    const { getContentsFilter, pageNumber, setPagination, setContentsFilter } =
        useFilterParams();

    const params = getContentsFilter();

    const { data, isLoading } = useAdmins({
        filters: params,
    });

    const [rowSelection, setRowSelection] = useState({});

    const columnHelper = createColumnHelper<AdminType>();

    const columns = useMemo<ColumnDef<AdminType>[]>(
        () => [
            TableCheckbox<AdminType>(columnHelper),
            columnHelper.accessor("cid", {
                id: "cid",
                cell: (info) => info.getValue(),
                header: () => <span>ID</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<AdminType>,
            columnHelper.accessor("title", {
                id: "title",
                cell: (info) => (
                    <CrudLinkCell id={info.row.original.id}>
                        {info.getValue()}
                    </CrudLinkCell>
                ),
                header: () => <span>名前</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<AdminType>,

            columnHelper.accessor("master_group", {
                id: "master_group",
                cell: (info) => {
                    const data = info.getValue();
                    if (data) {
                        return <>{data.title}</>;
                    }
                },
                header: () => <span>所属G</span>,

                // footer: (info) => info.column.id,
            }) as ColumnDef<AdminType>,
            columnHelper.accessor("role", {
                id: "role",
                cell: (info) => <RoleCell role={info.getValue()} />,
                header: () => <span>権限</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<AdminType>,

            columnHelper.accessor("public", {
                id: "public",
                cell: (info) => <StatusCell status={info.getValue()} />,
                header: () => <span>状態</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<AdminType>,
        ],
        []
    );

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
            <Button as={RouterLink} to={"./crud"} bg="cyan.800" color="white">
                新規登録
            </Button>
            <FormProvider>
                <Search
                    setContentsFilter={setContentsFilter}
                    setPagination={setPagination}
                    defaultValue={params}
                />
            </FormProvider>

            <PaginationTable
                table={table}
                collection={collection}
                setPagination={setPagination}
                pageNumber={pageNumber}
                isLoading={isLoading}
            />
        </Box>
    );
};

export default Index;
