import React, { useEffect } from "react";
import { PaginationTable } from "@/components/elements/Table/PaginationTable";
import { TableCheckbox } from "@/components/elements/Table/TableCheckBbox";
import {
    Box,
    Center,
    Icon,
    Image,
    LinkBox,
    LinkOverlay,
} from "@chakra-ui/react";
import {
    ColumnDef,
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useFiles } from "../api/getFiles";
import { FileType } from "../types";

import { StatusCell } from "@/features/misc/components/StatusCell";
import { FormProvider } from "@/providers/form";
import Search from "./Search";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";
import { GoFile } from "react-icons/go";
import { useFileMeta } from "../api/getFilesMeta";

const Index = () => {
    const { getContentsFilter, pageNumber, setPagination, setContentsFilter } =
        useFilterParams();

    const params = getContentsFilter();

    const { data, isLoading } = useFiles({
        filters: params,
    });

    const { data: meta } = useFileMeta();

    const [rowSelection, setRowSelection] = useState({});

    const columnHelper = createColumnHelper<FileType>();

    const columns = useMemo<ColumnDef<FileType>[]>(() => {
        const commonColumn = [
            columnHelper.accessor("fileCmsPath", {
                id: "fileCmsPath",
                cell: ({ row }) => {
                    const isImage = row.original.mime.includes("image/");
                    if (isImage) {
                        return (
                            <Center>
                                <LinkBox w="150px">
                                    <LinkOverlay
                                        href={row.original.fileCmsPath}
                                        isExternal
                                    >
                                        <Image src={row.original.fileCmsPath} />
                                    </LinkOverlay>
                                </LinkBox>
                            </Center>
                        );
                    } else {
                        return (
                            <Center>
                                <LinkBox w="150px">
                                    <LinkOverlay
                                        href={row.original.fileCmsPath}
                                        isExternal
                                    >
                                        <Icon as={GoFile} boxSize="full" />
                                    </LinkOverlay>
                                </LinkBox>
                            </Center>
                        );
                    }
                },
                header: () => <span>ファイル/画像</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<FileType>,
            columnHelper.accessor("filePath", {
                id: "filePath",
                cell: (info) => info.getValue(),
                header: () => <span>ファイルパス</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<FileType>,
            columnHelper.accessor("model", {
                id: "model",
                cell: ({ row }) => {
                    if (meta?.all_contents) {
                        const content = Object.entries(meta.all_contents).find(
                            ([key]) => key === row.original.model
                        );
                        return content ? content[1] : "";
                    }
                },
                header: () => <span>コンテンツ</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<FileType>,
            columnHelper.accessor("public", {
                id: "public",
                cell: (info) => <StatusCell status={info.getValue()} />,
                header: () => <span>公開状態</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<FileType>,
        ];

        return [TableCheckbox<FileType>(columnHelper), ...commonColumn];
    }, [data, meta]);

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
