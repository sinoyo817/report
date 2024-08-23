import React, { useEffect } from "react";
import { PaginationTable, TableCheckbox } from "@/components/elements/Table";
import {
    Box,
    Button,
    Center,
    HStack,
    Icon,
    Link,
    LinkBox,
    SimpleGrid,
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

import { useFreepageDirectories } from "../api/getFreepageDirectories";
import { FreepageDirectoryType, FreepageFilterParamType } from "../types";
import { PreviewCell } from "@/features/misc/components/PreviewCell";
import { StatusCell } from "@/features/misc/components/StatusCell";
import { DatePeriodCell } from "@/features/misc/components/DatePeriodCell";
import { FormProvider } from "@/providers/form";
import Search from "./Search";
import { useAuth } from "@/lib/auth";
import RemandCell from "@/components/elements/Misc/RemandCell";
import { CrudLinkCell } from "@/features/misc/components/CrudLinkCell";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";
import { adminPrefix } from "@/config";
import { useFreepageDirectoryMeta } from "../api/getFreepageDirectoryMeta";
import { CommonAnswerOptions } from "@/types";
import PageLimitSelect from "@/components/elements/Misc/PageLimitSelect";
import { ViewIcon } from "@chakra-ui/icons";
import { AiFillFileText, AiFillFolder } from "react-icons/ai";
import CopyTextCell from "@/features/mng-assets/components/CopyTextCell";

const Table = () => {
    const {
        getContentsFilter,
        pageNumber,
        setPagination,
        pageLimit,
        setPageLimit,
        setContentsFilter,
    } = useFilterParams();

    const user = useAuth();

    const params = getContentsFilter();

    const { data, isLoading } = useFreepageDirectories({
        filters: params,
    });

    const { data: meta } = useFreepageDirectoryMeta();

    const [rowSelection, setRowSelection] = useState({});

    const columnHelper = createColumnHelper<FreepageDirectoryType>();

    const columns = useMemo<ColumnDef<FreepageDirectoryType>[]>(() => {
        const commonColumn = [];
        commonColumn.push(
            columnHelper.accessor("cid", {
                id: "cid",
                cell: (info) => info.getValue(),
                header: () => <span>ID</span>,
                meta: {
                    thProps: { w: 4 },
                    tdProps: { w: 4 },
                },
                // footer: (info) => info.column.id,
            }) as ColumnDef<FreepageDirectoryType>
        );
        commonColumn.push(
            columnHelper.display({
                id: "title",
                header: () => <span>タイトル</span>,
                cell: ({ row }) => {
                    if (row.original.freepage_document) {
                        return (
                            <Center>
                                <HStack>
                                    <Icon as={AiFillFileText} boxSize={6} />
                                    <CrudLinkCell
                                        linkPrefix={`${adminPrefix}freepages/crud`}
                                        id={row.original.freepage_document.id}
                                    >
                                        {row.original.title}
                                    </CrudLinkCell>
                                </HStack>
                            </Center>
                        );
                    } else {
                        return (
                            <Center>
                                <HStack>
                                    <Icon as={AiFillFolder} boxSize={6} />
                                    <CrudLinkCell
                                        linkPrefix={`${adminPrefix}freepages/dir-crud`}
                                        id={row.original.id}
                                    >
                                        {row.original.title}
                                    </CrudLinkCell>
                                </HStack>
                            </Center>
                        );
                    }
                },
                meta: {
                    thProps: { maxW: 96, w: 72 },
                },
            }) as ColumnDef<FreepageDirectoryType>
        );

        commonColumn.push(
            columnHelper.display({
                id: "url",
                header: () => <span>URL</span>,
                cell: ({ row }) => {
                    if (row.original.freepage_document) {
                        return (
                            <CopyTextCell
                                text={`/${row.original.path_url}.html`}
                            />
                        );
                    } else {
                        return <>{`${row.original.path_url}`}</>;
                    }
                },
                meta: {
                    thProps: { maxW: 96, w: 72 },
                },
            }) as ColumnDef<FreepageDirectoryType>
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
            }) as ColumnDef<FreepageDirectoryType>
        );
        commonColumn.push(
            columnHelper.display({
                id: "published",
                header: () => <span>公開日</span>,
                cell: ({ row }) => {
                    if (row.original.freepage_document) {
                        return <>{row.original.freepage_document.published}</>;
                    } else {
                        return <>-</>;
                    }
                },
            }) as ColumnDef<FreepageDirectoryType>
        );
        commonColumn.push(
            columnHelper.display({
                id: "publicPeriod",
                header: () => <span>公開期間</span>,
                cell: ({ row }) => {
                    if (row.original.freepage_document) {
                        return (
                            <DatePeriodCell
                                startDate={
                                    row.original.freepage_document.start_date
                                }
                                endDate={
                                    row.original.freepage_document.end_date
                                }
                            />
                        );
                    } else {
                        return <>-</>;
                    }
                },
            }) as ColumnDef<FreepageDirectoryType>
        );
        commonColumn.push(
            columnHelper.accessor("modified", {
                id: "modified",
                cell: (info) => info.getValue(),
                header: () => <span>最終更新日時</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<FreepageDirectoryType>
        );
        commonColumn.push(
            columnHelper.display({
                id: "status",
                header: () => <span>ステータス</span>,
                cell: ({ row }) => {
                    if (row.original.freepage_document) {
                        return (
                            <StatusCell
                                status={row.original.freepage_document.status}
                            />
                        );
                    } else {
                        return <StatusCell status={row.original.status} />;
                    }
                },
            }) as ColumnDef<FreepageDirectoryType>
        );
        commonColumn.push(
            columnHelper.display({
                id: "public",
                header: () => <span>公開状態</span>,
                cell: ({ row }) => {
                    if (row.original.freepage_document) {
                        return (
                            <StatusCell
                                status={row.original.freepage_document.public}
                            />
                        );
                    } else {
                        return <StatusCell status={row.original.public} />;
                    }
                },
            }) as ColumnDef<FreepageDirectoryType>
        );
        commonColumn.push(
            columnHelper.display({
                id: "publicPeriod",
                header: () => <span>プレビュー</span>,
                cell: ({ row }) => {
                    if (row.original.freepage_document) {
                        return (
                            <LinkBox>
                                <Link
                                    target={"_blank"}
                                    href={`${adminPrefix}api/freepage-documents/preview/${row.original.freepage_document.id}`}
                                >
                                    <ViewIcon w={6} h={6} />
                                </Link>
                            </LinkBox>
                        );
                    } else {
                        return <>-</>;
                    }
                },
            }) as ColumnDef<FreepageDirectoryType>
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
            }) as ColumnDef<FreepageDirectoryType>
        );

        commonColumn.push(
            columnHelper.accessor("created", {
                id: "created",
                cell: (info) => info.getValue(),
                header: () => <span>作成日時</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<FreepageDirectoryType>
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
                }) as ColumnDef<FreepageDirectoryType>
            );
        }

        return [
            TableCheckbox<FreepageDirectoryType>(columnHelper),
            ...commonColumn,
        ];
    }, [user, data]);

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
            <FormProvider>
                <Search
                    setContentsFilter={setContentsFilter}
                    setPagination={setPagination}
                    defaultValue={params}
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
                isApproval={true}
                statusKey="freepage-directories"
            />
        </Box>
    );
};

export default Table;
