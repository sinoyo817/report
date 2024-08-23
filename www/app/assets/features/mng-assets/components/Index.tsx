import React, { useEffect } from "react";
import { PaginationTable } from "@/components/elements/Table/PaginationTable";
import { TableCheckbox } from "@/components/elements/Table/TableCheckBbox";
import {
    Box,
    Button,
    Center,
    FormControl,
    FormLabel,
    HStack,
    Icon,
    Image,
    LinkBox,
    LinkOverlay,
    Select,
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
import { useAssets } from "../api/getAssets";
import { AssetType } from "../types";

import { StatusCell } from "@/features/misc/components/StatusCell";
import { FormProvider } from "@/providers/form";
import Search from "./Search";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";
import { GoFile } from "react-icons/go";
import UploadFile from "./Upload";
import { CopyIcon } from "@chakra-ui/icons";
import CopyTextCell from "./CopyTextCell";

const Index = () => {
    const {
        getContentsFilter,
        pageNumber,
        setPagination,
        pageLimit,
        setPageLimit,
        setContentsFilter,
    } = useFilterParams();

    const params = getContentsFilter();
    const { data, isLoading, isFetching } = useAssets({
        filters: params,
    });

    const [rowSelection, setRowSelection] = useState({});

    const columnHelper = createColumnHelper<AssetType>();

    const columns = useMemo<ColumnDef<AssetType>[]>(() => {
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
            }) as ColumnDef<AssetType>,
            columnHelper.accessor("filePath", {
                id: "filePath",
                cell: (info) => <CopyTextCell text={info.getValue()} />,
                header: () => <span>ファイルパス</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<AssetType>,
            columnHelper.accessor("modified", {
                id: "modified",
                cell: (info) => info.getValue(),
                header: () => <span>最終更新日時</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<AssetType>,
            columnHelper.accessor("public", {
                id: "public",
                cell: (info) => <StatusCell status={info.getValue()} />,
                header: () => <span>公開状態</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<AssetType>,
        ];

        return [TableCheckbox<AssetType>(columnHelper), ...commonColumn];
    }, [data]);

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
                <UploadFile />
            </FormProvider>
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
