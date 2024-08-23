import React, { useEffect } from "react";
import { PaginationTable } from "@/components/elements/Table/PaginationTable";
import { TableCheckbox } from "@/components/elements/Table/TableCheckBbox";
import {
    Box,
    Button,
    Center,
    FormControl,
    FormLabel,
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
import { Link as RouterLink } from "react-router-dom";
import { useMasterContactCategories } from "../api/getMasterContactCategories";
import {
    MasterContactCategoryType,
    MasterContactCategoryFilterParamType,
    MasterContactCategoryFormValuesType,
} from "../types";
import { SubmitHandler } from "react-hook-form";
import { useCreateMasterContactCategory } from "../api/createMasterContactCategory";

import { GenerateFields } from "@/components/Form/GenerateFields";
import {
    masterContactCategoriesFields,
    masterContactCategoriesModel,
} from "../api/schema";

import { BaseForm } from "@/components/Form/BaseForm";
import { StatusCell } from "@/features/misc/components/StatusCell";
import { FormProvider } from "@/providers/form";
import Search from "./Search";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";
import { useUpdateMasterContactCategory } from "../api/updateMasterContactCategory";
import { EditableCell } from "@/components/elements/Misc/EditerbleCell";

import { OnDragEndResponder } from "@hello-pangea/dnd";
import { DndTable } from "@/components/elements/Table/DndTable";

import PageLimitSelect from "@/components/elements/Misc/PageLimitSelect";

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

    const { data, isLoading, isFetching } = useMasterContactCategories({
        filters: params,
    });

    const [isDnd, setIsDnd] = useBoolean();

    const [rowSelection, setRowSelection] = useState({});

    const createMutation = useCreateMasterContactCategory();

    const updateMutation = useUpdateMasterContactCategory();

    const columnHelper = createColumnHelper<MasterContactCategoryType>();

    const columns = useMemo<ColumnDef<MasterContactCategoryType>[]>(() => {
        const commonColumn = [
            columnHelper.accessor("cid", {
                id: "cid",
                cell: (info) => info.getValue(),
                header: () => <span>ID</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<MasterContactCategoryType>,
            columnHelper.accessor("title", {
                id: "title",
                cell: ({ row }) => {
                    const onSubmit = async (nextValue: string) => {
                        await updateMutation.mutateAsync({
                            data: { ...row.original, title: nextValue },
                            id: row.original.id,
                        });
                    };

                    return (
                        <EditableCell
                            field={row.original.title}
                            onSubmit={onSubmit}
                        />
                    );
                },
                header: () => <span>タイトル</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<MasterContactCategoryType>,
            columnHelper.accessor("public", {
                id: "public",
                cell: (info) => <StatusCell status={info.getValue()} />,
                header: () => <span>公開状態</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<MasterContactCategoryType>,
        ];

        if (isDnd) {
            return commonColumn;
        }

        return [
            TableCheckbox<MasterContactCategoryType>(columnHelper),
            ...commonColumn,
        ];
    }, [isDnd, data]);

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

    const createOnSubmit: SubmitHandler<
        MasterContactCategoryFormValuesType
    > = async (values) => {
        const data = await createMutation.mutateAsync({ data: values });
    };

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

    const elements = GenerateFields<MasterContactCategoryFormValuesType>({
        model: masterContactCategoriesModel,
        fields: masterContactCategoriesFields,
    });

    return (
        <Box>
            <FormProvider>
                <BaseForm<MasterContactCategoryFormValuesType>
                    onSubmit={createOnSubmit}
                    w="50%"
                >
                    {elements}

                    <Center mt="2">
                        <Button type="submit">登録</Button>
                    </Center>
                </BaseForm>
            </FormProvider>
            <FormProvider>
                <Search
                    setContentsFilter={setContentsFilter}
                    setPagination={setPagination}
                    defaultValue={params}
                />
            </FormProvider>

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
