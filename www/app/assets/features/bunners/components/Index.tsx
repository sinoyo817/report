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
     ExpandedState,
    getCoreRowModel,
     getExpandedRowModel,
    getFilteredRowModel,
     Row,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useBunners } from "../api/getBunners";
import { BunnerType } from "../types";

import { StatusCell } from "@/features/misc/components/StatusCell";
import { DatePeriodCell } from "@/features/misc/components/DatePeriodCell";
import { FormProvider } from "@/providers/form";
import Search from "./Search";
import { CrudLinkCell } from "@/features/misc/components/CrudLinkCell";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";
 
import PageLimitSelect from "@/components/elements/Misc/PageLimitSelect";

import { useBunnerMeta } from "../api/getBunnerMeta";
 
import { useUpdateBunner } from "../api/updateBunner";
import { OnDragEndResponder } from "@hello-pangea/dnd";
import { DndTable } from "@/components/elements/Table/DndTable"; 
 
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
    } = useFilterParams();

    const { data, isLoading, isFetching } = useBunners({
        filters: getContentsFilter(),
    });

    const { data: meta } = useBunnerMeta();

    const [isDnd, setIsDnd] = useBoolean();

    const [rowSelection, setRowSelection] = useState({});

    const updateMutation = useUpdateBunner();

    const { data: localeSetting } = useLocaleSetting();

    const locales = localeSetting?.locales || [];

    const [expanded, setExpanded] = useState<ExpandedState>({});

    const rowSpan = locales.length <= 0 ? 1 : locales.length;    

    const columnHelper = createColumnHelper<BunnerType>();

    const columns = useMemo<ColumnDef<BunnerType>[]>(() => {
        const commonColumn = [];

        commonColumn.push(
            columnHelper.accessor("cid", {
                id: "cid",
                cell: (info) => {
                    return info.getValue();
                },
                header: () => <span>ID</span>,
                
                meta: {
                    tdProps: {
                        rowSpan: rowSpan,
                    },
                },
                
            }) as ColumnDef<BunnerType>
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
                }) as ColumnDef<BunnerType>
            );
        }
        
        commonColumn.push(
            columnHelper.accessor("title", {
                id: "title",
                cell: (info) => {
                     
                    const isForegin = info.row.original.locale !== undefined;
                    if (isForegin) {
                        const isTranslation = info.row.original.is_translation;
                        return (
                            <CrudLinkCell
                                id={info.row.original.id}
                                linkPrefix={`crud/${info.row.original.locale}`}
                            >
                                {isTranslation ? info.getValue() : "新規登録"}
                            </CrudLinkCell>
                        );
                    }
                    

                    return (
                        <CrudLinkCell id={info.row.original.id}>
                            {info.getValue()}
                        </CrudLinkCell>
                    );
                },
                header: () => <span>タイトル</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<BunnerType>
        );
         
        commonColumn.push(
            columnHelper.accessor("published", {
                id: "published",
                cell: (info) => {
                    const data = info.getValue();
                     
                    const isForegin = info.row.original.locale !== undefined;

                    if (isForegin) {
                        const isTranslation = info.row.original.is_translation;

                        if (!isTranslation) {
                            return "-";
                        }
                        if (data) {
                            return <>{data}</>;
                        }
                    }
                    

                    if (data) {
                        return <>{data}</>;
                    }
                },
                header: () => <span>公開日</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<BunnerType>
        );
         commonColumn.push(
            columnHelper.accessor(
                (row) => {
                    return { startDate: row.start_date, endDate: row.end_date };
                },
                {
                    id: "publicPeriod",
                    cell: (info) => {
                        
                        const isForegin =
                            info.row.original.locale !== undefined;

                        if (isForegin) {
                            const isTranslation =
                                info.row.original.is_translation;

                            if (!isTranslation) {
                                return "-";
                            }
                            return <DatePeriodCell {...info.getValue()} />;
                        }
                        
                        return <DatePeriodCell {...info.getValue()} />;
                    },
                    header: () => <span>公開期間</span>,
                    // footer: (info) => info.column.id,
                }
            ) as ColumnDef<BunnerType>
        );
         commonColumn.push(
            columnHelper.accessor("modified", {
                id: "modified",
                cell: (info) => {
                    const data = info.getValue();

                    
                    const isForegin = info.row.original.locale !== undefined;

                    if (isForegin) {
                        const isTranslation = info.row.original.is_translation;

                        if (!isTranslation) {
                            return "-";
                        }
                        if (data) {
                            return <>{data}</>;
                        }
                    }
                    

                    if (data) {
                        return <>{data}</>;
                    }
                },
                header: () => <span>最終更新日時</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<BunnerType>
        );
        commonColumn.push(
            columnHelper.accessor("status", {
                id: "status",
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
                header: () => <span>ステータス</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<BunnerType>
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
            }) as ColumnDef<BunnerType>
        );

        commonColumn.push(
            columnHelper.accessor("created", {
                id: "created",
                cell: (info) => {
                    const data = info.getValue();
                    
                    const isForegin = info.row.original.locale !== undefined;
                    if (isForegin) {
                        const isTranslation = info.row.original.is_translation;

                        if (!isTranslation) {
                            return "-";
                        }
                        if (data) {
                            return <>{data}</>;
                        }
                    }
                    
                    if (data) {
                        return <>{data}</>;
                    }
                },
                header: () => <span>作成日時</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<BunnerType>
        );

         if (isDnd) {
            return commonColumn;
        }
        return [TableCheckbox<BunnerType>(columnHelper), ...commonColumn];
    }, [isDnd,locales,meta,data]);

    useEffect(() => {
        setRowSelection({});
    }, [pageNumber, isDnd, pageLimit]);

    const localeTableOptions = {
        getSubRows: (row: BunnerType) => {
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
        enableRowSelection: (row: Row<BunnerType>) => {
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
        enableSubRowSelection: false,
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
            <FormProvider>
                <Search />
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
