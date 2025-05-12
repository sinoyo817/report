import React, { useEffect } from "react";
import { PaginationTable, TableCheckbox } from "@/components/elements/Table";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    SimpleGrid,
    Switch,
    Text,
    useBoolean,
} from "@chakra-ui/react";
import {
    ColumnDef,
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useMasterGroups } from "../api/getMasterGroups";
import { MasterGroupType } from "../types";

import { StatusCell } from "@/features/misc/components/StatusCell";
import { DatePeriodCell } from "@/features/misc/components/DatePeriodCell";
import { FormProvider } from "@/providers/form";
import Search from "./Search";
import { CrudLinkCell } from "@/features/misc/components/CrudLinkCell";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";
 
import PageLimitSelect from "@/components/elements/Misc/PageLimitSelect";

import { useUpdateMasterGroup } from "../api/updateMasterGroup";
import { OnDragEndResponder } from "@hello-pangea/dnd";
import { DndTable } from "@/components/elements/Table/DndTable";

const Index = () => {
    const {
        getContentsFilter,
        pageNumber,
        setPagination,
        pageLimit,
        setPageLimit,
    } = useFilterParams();

    const { data, isLoading, isFetching } = useMasterGroups({
        filters: getContentsFilter(),
    });

    const [isDnd, setIsDnd] = useBoolean();
    const [rowSelection, setRowSelection] = useState({});

    const updateMutation = useUpdateMasterGroup();

    const columnHelper = createColumnHelper<MasterGroupType>();

    const columns = useMemo<ColumnDef<MasterGroupType>[]>(() => {
        const commonColumn = [];

        commonColumn.push(
            columnHelper.accessor("cid", {
                id: "cid",
                cell: (info) => {
                    return info.getValue();
                },
                header: () => <span>ID</span>,
            }) as ColumnDef<MasterGroupType>
        );
        commonColumn.push(
            columnHelper.accessor("title", {
                id: "title",
                cell: (info) => {
                    return (
                        <CrudLinkCell id={info.row.original.id}>
                            {info.getValue()}
                        </CrudLinkCell>
                    );
                },
                header: () => <span>タイトル</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<MasterGroupType>
        );
        commonColumn.push(
            columnHelper.accessor("published", {
                id: "published",
                cell: (info) => {
                    const data = info.getValue();
                    if (data) {
                        return <>{data}</>;
                    }
                },
                header: () => <span>公開日</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<MasterGroupType>
        );
         commonColumn.push(
            columnHelper.accessor(
                (row) => {
                    return { startDate: row.start_date, endDate: row.end_date };
                },
                {
                    id: "publicPeriod",
                    cell: (info) => {
                        return <DatePeriodCell {...info.getValue()} />;
                    },
                    header: () => <span>公開期間</span>,
                    // footer: (info) => info.column.id,
                }
            ) as ColumnDef<MasterGroupType>
        );
         commonColumn.push(
            columnHelper.accessor("modified", {
                id: "modified",
                cell: (info) => {
                    const data = info.getValue();
                    if (data) {
                        return <>{data}</>;
                    }
                },
                header: () => <span>最終更新日時</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<MasterGroupType>
        );
        commonColumn.push(
            columnHelper.accessor("status", {
                id: "status",
                cell: (info) => {
                    const data = info.getValue();
                    return <StatusCell status={data} />;
                },
                header: () => <span>ステータス</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<MasterGroupType>
        );
        commonColumn.push(
            columnHelper.accessor("public", {
                id: "public",
                cell: (info) => {
                    const data = info.getValue();
                    return <StatusCell status={data} />;
                },
                header: () => <span>公開状態</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<MasterGroupType>
        );
        commonColumn.push(
            columnHelper.accessor("created", {
                id: "created",
                cell: (info) => {
                    const data = info.getValue();
                    if (data) {
                        return <>{data}</>;
                    }
                },
                header: () => <span>作成日時</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<MasterGroupType>
        );
         if (isDnd) {
            return commonColumn;
        }
        return [TableCheckbox<MasterGroupType>(columnHelper), ...commonColumn];
    }, [isDnd,data]);

    useEffect(() => {
        setRowSelection({});
    }, [pageNumber, isDnd, pageLimit]);

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

    const onDragEnd: OnDragEndResponder &
        React.DragEventHandler<HTMLTableElement> = async (result) => {
        if ("draggableId" in result) {
            const target = data?.data.find(
                (item) => item.id === result.draggableId
            );
            if (target && result.destination?.index) {
                await updateMutation.mutateAsync({
                    data: { ...target, sequence: result.destination.index },
                    id: target.id,
                });
            }
        }
    };

    return (
        <Box>
            <Button as={RouterLink} to={"./crud"} bg="cyan.800" color="white">
                新規登録
            </Button>
            {/* <FormProvider>
                <Search />
            </FormProvider> */}
            <SimpleGrid columns={2} w="25%">
                <FormControl>
                    <FormLabel htmlFor="dnd">並び替え</FormLabel>
                    <Switch
                        colorScheme="teal"
                        size="lg"
                        id="dnd"
                        onChange={setIsDnd.toggle}
                    />
                </FormControl>
                <PageLimitSelect
                    pageLimit={pageLimit}
                    setPageLimit={setPageLimit}
                />
            </SimpleGrid>
            {isDnd ? (
                <DndTable
                    table={table}
                    collection={collection}
                    setPagination={setPagination}
                    pageNumber={pageNumber}
                    isLoading={isLoading || isFetching}
                    pageLimit={pageLimit}
                    setPageLimit={setPageLimit}
                    onDragEnd={onDragEnd}
                />
            ) : (
            <PaginationTable
                  table={table}
                  collection={collection}
                  setPagination={setPagination}
                  pageNumber={pageNumber}
                  isLoading={isLoading}
              />
            )}
        </Box>
    );
};

export default Index;
