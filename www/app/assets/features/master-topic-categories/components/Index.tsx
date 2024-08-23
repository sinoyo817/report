import React, { useCallback, useEffect } from "react";
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
    ExpandedState,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    Row,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useMasterTopicCategories } from "../api/getMasterTopicCategories";
import {
    MasterTopicCategoryType,
    MasterTopicCategoryFilterParamType,
    MasterTopicCategoryFormValuesType,
} from "../types";
import { SubmitHandler } from "react-hook-form";
import { useCreateMasterTopicCategory } from "../api/createMasterTopicCategory";

import { GenerateFields } from "@/components/Form/GenerateFields";
import {
    masterTopicCategoriesFields,
    masterTopicCategoriesModel,
} from "../api/schema";

import { BaseForm } from "@/components/Form/BaseForm";
import { StatusCell } from "@/features/misc/components/StatusCell";
import { FormProvider } from "@/providers/form";
import Search from "./Search";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";
import { useUpdateMasterTopicCategory } from "../api/updateMasterTopicCategory";
import { EditableCell } from "@/components/elements/Misc/EditerbleCell";

import { OnDragEndResponder } from "@hello-pangea/dnd";
import { DndTable } from "@/components/elements/Table/DndTable";

import PageLimitSelect from "@/components/elements/Misc/PageLimitSelect";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useLocaleSetting } from "@/features/misc/api/getLocaleSettings";
import { defaultLocale } from "@/config";

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

    const { data, isLoading, isFetching } = useMasterTopicCategories({
        filters: params,
    });

    const { data: localeSetting } = useLocaleSetting();

    const locales = localeSetting?.locales || [];

    const [isDnd, setIsDnd] = useBoolean();

    const [rowSelection, setRowSelection] = useState({});

    const [expanded, setExpanded] = useState<ExpandedState>({});

    const createMutation = useCreateMasterTopicCategory();

    const updateMutation = useUpdateMasterTopicCategory();

    const columnHelper = createColumnHelper<MasterTopicCategoryType>();

    const rowSpan = locales?.length || 1;

    const columns = useMemo<ColumnDef<MasterTopicCategoryType>[]>(() => {
        const commonColumn = [];
            commonColumn.push(
                columnHelper.accessor("cid", {
                    id: "cid",
                    cell: (info) => info.getValue(),
                    header: () => <span>ID</span>,
                    meta: {
                        tdProps: {
                            rowSpan: rowSpan,
                        },
                    },
                    // footer: (info) => info.column.id,
                }) as ColumnDef<MasterTopicCategoryType>,
            );
            if (locales.length > 1) {
                commonColumn.push(
                    columnHelper.display({
                        id: "locale",
                        header: () => (
                            <Box
                                {...{
                                    onClick: table.getToggleAllRowsExpandedHandler(),
                                }}
                                cursor="pointer"
                            >
                                言語
                                {table.getIsAllRowsExpanded() ? (
                                    <ChevronDownIcon boxSize="6" />
                                ) : (
                                    <ChevronUpIcon boxSize="6" />
                                )}
                            </Box>
                        ),
                        cell: (info) => {
                            const isForegin = info.row.original.locale !== undefined;
                            const localeTitle = isForegin
                                ? locales?.find(
                                    (item) => item.locale === info.row.original.locale
                                )?.title
                                : locales?.find((item) => item.locale === defaultLocale)
                                    ?.title;
                            return (
                                <>
                                    {info.row.getCanExpand() ? (
                                        <Box
                                            {...{
                                                onClick:
                                                    info.row.getToggleExpandedHandler(),
                                                style: { cursor: "pointer" },
                                            }}
                                        >
                                            {info.row.getIsExpanded() ? (
                                                <>
                                                    {localeTitle}
                                                    <ChevronDownIcon boxSize="6" />
                                                </>
                                            ) : (
                                                <>
                                                    {localeTitle}
                                                    <ChevronUpIcon boxSize="6" />
                                                </>
                                            )}
                                        </Box>
                                    ) : (
                                        <>{localeTitle}</>
                                    )}
                                </>
                            );
                        },
                    }) as ColumnDef<MasterTopicCategoryType>,
                );
            }
            commonColumn.push(
                columnHelper.accessor("title", {
                    id: "title",
                    cell: ({ row }) => {
                        const title = row.original.title;
                        const isForegin = row.original.locale !== undefined;

                        const onSubmit = async (nextValue: string) => {
                            await updateMutation.mutateAsync({
                                data: {
                                    ...row.original,
                                    title: nextValue,
                                    class:
                                        row.original.locale !== undefined &&
                                        !row.original.is_translation
                                            ? ""
                                            : row.original.class,
                                },
                                id: row.original.id,
                                locale: row.original.locale,
                            });
                        };
                        if (isForegin) {
                            const isTranslation = row.original.is_translation;
                            return (
                                <EditableCell
                                    field={isTranslation ? title : "新規登録"}
                                    onSubmit={onSubmit}
                                />
                            );
                        }

                        return <EditableCell field={title} onSubmit={onSubmit} />;
                    },
                    header: () => <span>タイトル</span>,
                    // footer: (info) => info.column.id,
                }) as ColumnDef<MasterTopicCategoryType>,
            );
            commonColumn.push(
                columnHelper.accessor("class", {
                    id: "class",
                    cell: ({ row }) => {
                        const classTitle = row.original.class;
                        const isForegin = row.original.locale !== undefined;
                        const onSubmit = async (nextValue: string) => {
                            await updateMutation.mutateAsync({
                                data: { ...row.original, class: nextValue },
                                id: row.original.id,
                                locale: row.original.locale,
                            });
                        };
                        if (isForegin) {
                            const isTranslation = row.original.is_translation;
                            return (
                                <EditableCell
                                    field={isTranslation ? classTitle : ""}
                                    onSubmit={onSubmit}
                                />
                            );
                        }

                        return (
                            <EditableCell field={classTitle} onSubmit={onSubmit} />
                        );
                    },
                    header: () => <span>class</span>,
                    // footer: (info) => info.column.id,
                }) as ColumnDef<MasterTopicCategoryType>,
            );
            commonColumn.push(
                columnHelper.accessor("public", {
                    id: "public",
                    cell: (info) => {
                        const data = info.getValue();
                        const isForegin = info.row.original.locale !== undefined;

                        if (isForegin) {
                            const isTranslation = info.row.original.is_translation;

                            if (!isTranslation) {
                                return "-";
                            }
                            return <StatusCell status={data} />;
                        }

                        return <StatusCell status={data} />;
                    },
                    header: () => <span>公開状態</span>,
                    // footer: (info) => info.column.id,
                }) as ColumnDef<MasterTopicCategoryType>,
            );

        if (isDnd) {
            return commonColumn;
        }

        return [
            TableCheckbox<MasterTopicCategoryType>(columnHelper),
            ...commonColumn,
        ];
    }, [isDnd, data, locales]);

    useEffect(() => {
        setRowSelection({});
    }, [pageNumber, isDnd, pageLimit]);

    const localeTableOptions = {
        getSubRows: (row: MasterTopicCategoryType) => {
            if (row._translations) {
                const items = Object.entries(row._translations).map(
                    ([, item]) => item
                );

                return items;
            }
            return undefined;
        },
        onExpandedChange: setExpanded,
        getExpandedRowModel: getExpandedRowModel(),
        enableRowSelection: (row: Row<MasterTopicCategoryType>) => {
            const isForeign = row.original.locale !== undefined;
            if (isForeign) {
                const originalRow = row.getParentRow()?.original;

                if (
                    originalRow?.public === "published" &&
                    row.original.is_translation
                ) {
                    return true;
                }
                return false;
            }
            return true;
        },
    };

    const table = useReactTable({
        data: data?.data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            rowSelection,
            expanded,
        },
        onRowSelectionChange: setRowSelection,
        manualPagination: true,
        getFilteredRowModel: getFilteredRowModel(),
        ...localeTableOptions,
    });

    const collection = data?.collection;

    const createOnSubmit: SubmitHandler<
        MasterTopicCategoryFormValuesType
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

    const elements = GenerateFields<MasterTopicCategoryFormValuesType>({
        model: masterTopicCategoriesModel,
        fields: masterTopicCategoriesFields,
    });

    return (
        <Box>
            <FormProvider>
                <BaseForm<MasterTopicCategoryFormValuesType>
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
