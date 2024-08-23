import React, { useEffect } from "react";
import { PaginationTable, TableCheckbox } from "@/components/elements/Table";
import { Box, Button, SimpleGrid } from "@chakra-ui/react";
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

import { useTopics } from "../api/getTopics";
import { TopicType, TopicFilterParamType } from "../types";
import { PreviewCell } from "@/features/misc/components/PreviewCell";
import { StatusCell } from "@/features/misc/components/StatusCell";
import { DatePeriodCell } from "@/features/misc/components/DatePeriodCell";
import { FormProvider } from "@/providers/form";
import Search from "./Search";
import { useAuth } from "@/lib/auth";
import RemandCell from "@/components/elements/Misc/RemandCell";
import { CrudLinkCell } from "@/features/misc/components/CrudLinkCell";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";
import { useTopicMeta } from "../api/getTopicMeta";
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

    const user = useAuth();

    const { data, isLoading } = useTopics({
        filters: params,
    });

    const { data: meta } = useTopicMeta();

    const { data: localeSetting } = useLocaleSetting();

    const locales = localeSetting?.locales || [];

    const [rowSelection, setRowSelection] = useState({});

    const [expanded, setExpanded] = useState<ExpandedState>({});

    const columnHelper = createColumnHelper<TopicType>();

    const rowSpan = locales.length <= 0 ? 1 : locales.length;

    const columns = useMemo<ColumnDef<TopicType>[]>(() => {
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
            }) as ColumnDef<TopicType>
        );
        if (locales.length > 1) {
            commonColumn.push(
                columnHelper.display({
                    id: "locale",
                    header: () => (
                        <Box
                            {...{
                                onClick:
                                    table.getToggleAllRowsExpandedHandler(),
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
                        const isForegin =
                            info.row.original.locale !== undefined;
                        const localeTitle = isForegin
                            ? locales?.find(
                                  (item) =>
                                      item.locale === info.row.original.locale
                              )?.title
                            : locales?.find(
                                  (item) => item.locale === defaultLocale
                              )?.title;
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
                }) as ColumnDef<TopicType>
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
            }) as ColumnDef<TopicType>
        );
        commonColumn.push(
            columnHelper.accessor("modified_admin", {
                id: "modified_admin",
                cell: (info) => {
                    const isForegin = info.row.original.locale !== undefined;

                    if (isForegin) {
                        return "-";
                    }

                    const data = info.getValue();
                    if (data) {
                        return <>{data.title}</>;
                    }
                },
                header: () => <span>最終更新者</span>,
                meta: {
                    tdProps: {
                        rowSpan: rowSpan,
                    },
                },
                // footer: (info) => info.column.id,
            }) as ColumnDef<TopicType>
        );
        if (meta) {
            if (meta.settings.category === "single") {
                commonColumn.push(
                    columnHelper.accessor("master_topic_category", {
                        id: "master_topic_category",
                        cell: (info) => {
                            const data = info.getValue();
                            if (data) {
                                return <>{data.title}</>;
                            }
                        },
                        header: () => <span>カテゴリ</span>,
                        meta: {
                            tdProps: {
                                rowSpan: rowSpan,
                            },
                        },

                        // footer: (info) => info.column.id,
                    }) as ColumnDef<TopicType>
                );
            }
            if (meta.settings.category === "multi") {
                commonColumn.push(
                    columnHelper.accessor("master_topic_categories", {
                        id: "master_topic_categories",
                        cell: (info) => {
                            const data = info.getValue();
                            if (data) {
                                const title = data
                                    .map((i) => i.title)
                                    .join("、");
                                return <>{title}</>;
                            }
                        },
                        header: () => <span>カテゴリ</span>,
                        meta: {
                            tdProps: {
                                rowSpan: rowSpan,
                            },
                        },
                        // footer: (info) => info.column.id,
                    }) as ColumnDef<TopicType>
                );
            }
        }
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
            }) as ColumnDef<TopicType>
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
            ) as ColumnDef<TopicType>
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
            }) as ColumnDef<TopicType>
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
            }) as ColumnDef<TopicType>
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
            }) as ColumnDef<TopicType>
        );
        commonColumn.push(
            columnHelper.display({
                id: "actions",
                header: () => <span>プレビュー</span>,
                cell: (info) => {
                    const isForegin = info.row.original.locale !== undefined;

                    if (isForegin) {
                        const isTranslation = info.row.original.is_translation;

                        if (!isTranslation) {
                            return "-";
                        }
                        return (
                            <PreviewCell
                                id={`${info.row.original.id}?locale=${info.row.original.locale}`}
                            />
                        );
                    }

                    return <PreviewCell id={info.row.original.id} />;
                },
            }) as ColumnDef<TopicType>
        );

        commonColumn.push(
            columnHelper.accessor("create_admin", {
                id: "create_admin",
                cell: (info) => {
                    const isForegin = info.row.original.locale !== undefined;

                    if (isForegin) {
                        return "-";
                    }

                    const data = info.getValue();
                    if (data) {
                        return <>{data.title}</>;
                    }
                },
                header: () => <span>作成者</span>,
                meta: {
                    tdProps: {
                        rowSpan: rowSpan,
                    },
                },
                // footer: (info) => info.column.id,
            }) as ColumnDef<TopicType>
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
            }) as ColumnDef<TopicType>
        );

        if (meta && meta.settings.approve === "on") {
            commonColumn.push(
                columnHelper.display({
                    id: "remand",
                    cell: (info) => {
                        const isForegin =
                            info.row.original.locale !== undefined;

                        if (isForegin) {
                            return "-";
                        }

                        return (
                            <RemandCell
                                approval_remands={
                                    info.row.original.approval_remands
                                }
                            />
                        );
                    },
                    header: () => <span>差戻し履歴</span>,
                }) as ColumnDef<TopicType>
            );
        }

        return [TableCheckbox<TopicType>(columnHelper), ...commonColumn];
    }, [user, data, meta, locales]);

    useEffect(() => {
        setRowSelection({});
    }, [pageNumber, pageLimit]);

    const localeTableOptions = {
        getSubRows: (row: TopicType) => {
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
        enableRowSelection: (row: Row<TopicType>) => {
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
