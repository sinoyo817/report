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
import { useEvents } from "../api/getEvents";
import { EventType } from "../types";
import { PreviewCell } from "@/features/misc/components/PreviewCell";
import { StatusCell } from "@/features/misc/components/StatusCell";
import { DatePeriodCell } from "@/features/misc/components/DatePeriodCell";
import { FormProvider } from "@/providers/form";
import Search from "./Search";
import { CrudLinkCell } from "@/features/misc/components/CrudLinkCell";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";

import PageLimitSelect from "@/components/elements/Misc/PageLimitSelect";
import { CommonAnswerOptions } from "@/types";
import { useOnlyUpdateEvents } from "../api/onlyUpdateEvents";
import { useEventMeta } from "../api/getEventMeta";
import TopCell from "@/features/misc/components/TopCell";
import RemandCell from "@/components/elements/Misc/RemandCell";

const Index = () => {
    const {
        getContentsFilter,
        pageNumber,
        setPagination,
        pageLimit,
        setPageLimit,
        setContentsFilter,
    } = useFilterParams();

    const param = getContentsFilter();

    const { data, isLoading, isFetching } = useEvents({
        filters: param,
    });

    const { data: meta } = useEventMeta();

    const [rowSelection, setRowSelection] = useState({});

    const columnHelper = createColumnHelper<EventType>();

    const mutation = useOnlyUpdateEvents();

    const columns = useMemo<ColumnDef<EventType>[]>(() => {
        const commonColumn = [];
        commonColumn.push(
            columnHelper.display({
                id: "is_top",
                cell: ({ row }) => {
                    const onSubmit = async (
                        nextValue: keyof CommonAnswerOptions
                    ) => {
                        await mutation.mutateAsync({
                            data: {
                                id: row.original.id,
                                is_top: nextValue,
                            },
                            id: row.original.id,
                        });
                    };
                    return (
                        <TopCell
                            field={row.original.is_top}
                            onSubmit={onSubmit}
                        />
                    );
                },
                header: () => <span>TOP</span>,
            }) as ColumnDef<EventType>
        );
        commonColumn.push(
            columnHelper.accessor("cid", {
                id: "cid",
                cell: (info) => info.getValue(),
                header: () => <span>ID</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<EventType>
        );
        commonColumn.push(
            columnHelper.accessor("title", {
                id: "title",
                cell: (info) => (
                    <CrudLinkCell id={info.row.original.id}>
                        {info.getValue()}
                    </CrudLinkCell>
                ),
                header: () => <span>イベント名</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<EventType>
        );
        commonColumn.push(
            columnHelper.accessor("modified_admin", {
                id: "modified_admin",
                cell: (info) => {
                    const data = info.getValue();
                    if (data) {
                        return <>{data.title}</>;
                    }
                },
                header: () => <span>最終更新者</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<EventType>
        );

        commonColumn.push(
            columnHelper.display({
                id: "event_dates",
                header: () => <span>開催日</span>,
                cell: ({ row }) => {
                    const type = row.original.event_date_type;
                    if (type === "range") {
                        return (
                            <DatePeriodCell
                                startDate={row.original.event_start_date}
                                endDate={row.original.event_end_date}
                            />
                        );
                    }
                    if (type === "step") {
                        const ellipsis =
                            row.original.event_dates_values.length >= 50
                                ? "..."
                                : "";
                        return (
                            row.original.event_dates_values.slice(0, 50) +
                            ellipsis
                        );
                    }
                    if (type === "text") {
                        const ellipsis =
                            row.original.event_date_text.length >= 50
                                ? "..."
                                : "";
                        return (
                            row.original.event_date_text.slice(0, 50) + ellipsis
                        );
                    }
                },
            }) as ColumnDef<EventType>
        );
        commonColumn.push(
            columnHelper.accessor(
                (row) => {
                    return { startDate: row.start_date, endDate: row.end_date };
                },
                {
                    id: "publicPeriod",
                    cell: (info) => <DatePeriodCell {...info.getValue()} />,
                    header: () => <span>公開期間</span>,
                    // footer: (info) => info.column.id,
                }
            ) as ColumnDef<EventType>
        );
        commonColumn.push(
            columnHelper.accessor("modified", {
                id: "modified",
                cell: (info) => info.getValue(),
                header: () => <span>最終更新日時</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<EventType>
        );
        commonColumn.push(
            columnHelper.accessor("status", {
                id: "status",
                cell: (info) => <StatusCell status={info.getValue()} />,
                header: () => <span>ステータス</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<EventType>
        );
        commonColumn.push(
            columnHelper.accessor("public", {
                id: "public",
                cell: (info) => <StatusCell status={info.getValue()} />,
                header: () => <span>公開状態</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<EventType>
        );
        commonColumn.push(
            columnHelper.display({
                id: "actions",
                header: () => <span>プレビュー</span>,
                cell: ({ row }) => <PreviewCell id={row.original.id} />,
            }) as ColumnDef<EventType>
        );

        commonColumn.push(
            columnHelper.accessor("create_admin", {
                id: "create_admin",
                cell: (info) => {
                    const data = info.getValue();
                    if (data) {
                        return <>{data.title}</>;
                    }
                },
                header: () => <span>作成者</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<EventType>
        );

        commonColumn.push(
            columnHelper.accessor("created", {
                id: "created",
                cell: (info) => info.getValue(),
                header: () => <span>作成日時</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<EventType>
        );

        if (meta && meta.settings.approve === "on") {
            commonColumn.push(
                columnHelper.display({
                    id: "remand",
                    cell: ({ row }) => (
                        <RemandCell
                            approval_remands={row.original.approval_remands}
                        />
                    ),
                    header: () => <span>差戻し履歴</span>,
                }) as ColumnDef<EventType>
            );
        }

        return [TableCheckbox<EventType>(columnHelper), ...commonColumn];
    }, [data]);

    useEffect(() => {
        setRowSelection({});
    }, [pageNumber, pageLimit]);

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
                    defaultValue={param}
                />
            </FormProvider>

            <SimpleGrid columns={2} w="25%">
                <PageLimitSelect
                    pageLimit={pageLimit}
                    setPageLimit={setPageLimit}
                />
            </SimpleGrid>

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
