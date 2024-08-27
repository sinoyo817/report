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
    HStack,
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
import { useDayWorks } from "../api/getDayWorks";
import { DayWorkType } from "../types";

import { StatusCell } from "@/features/misc/components/StatusCell";
import { DatePeriodCell } from "@/features/misc/components/DatePeriodCell";
import { FormProvider } from "@/providers/form";
import Search from "./Search";
import { CrudLinkCell } from "@/features/misc/components/CrudLinkCell";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";

import { adminPrefix } from "@/config";
 
import PageLimitSelect from "@/components/elements/Misc/PageLimitSelect";

import { useDayWorkMeta } from "../api/getDayWorkMeta";
 
import { useUpdateDayWork } from "../api/updateDayWork";
import { OnDragEndResponder } from "@hello-pangea/dnd";
import { DndTable } from "@/components/elements/Table/DndTable";
import { BaseBlockEntityType } from "@/types";


const Index = () => {
    const {
        getContentsFilter,
        pageNumber,
        setPagination,
        pageLimit,
        setPageLimit,
    } = useFilterParams();

    const { data, isLoading, isFetching } = useDayWorks({
        filters: getContentsFilter(),
    });

    const { data: meta } = useDayWorkMeta();

    const [isDnd, setIsDnd] = useBoolean();

    const initialCsvLink = `${adminPrefix}api/day-works/csv-download`;
    const [csvLink, setcsvLink] = useState<string>(initialCsvLink);

    const [rowSelection, setRowSelection] = useState({});

    const updateMutation = useUpdateDayWork();

    const columnHelper = createColumnHelper<DayWorkType>();

    const columns = useMemo<ColumnDef<DayWorkType>[]>(() => {
        const commonColumn = [];

        commonColumn.push(
            columnHelper.accessor("work_date", {
                id: "work_date",
                cell: (info) => {

                    return (
                        <CrudLinkCell id={info.row.original.id}>
                            {info.getValue()}
                        </CrudLinkCell>
                    );
                },
                header: () => <span>タイトル</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<DayWorkType>
        );
        commonColumn.push(
            columnHelper.accessor("total", {
                id: "total",
                cell: (info) => {
                    const blocks = info.row.original.blocks;
                    const sum = calculateTotal(blocks);
                    return <>{sum}</>;
                },
                header: () => <span>合計</span>,
            }) as ColumnDef<DayWorkType>
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
                // footer: (info) => info.column.id,
            }) as ColumnDef<DayWorkType>
        );

        commonColumn.push(
            columnHelper.accessor("work_date", {
                id: "work_date",
                cell: (info) => {

                    return (
                        <Button as={RouterLink} to={"./report/"+info.row.original.id} bg="cyan.800" color="white">
                            送信
                        </Button>
                    );
                },
                header: () => <span>日報送信</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<DayWorkType>
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
            }) as ColumnDef<DayWorkType>
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
            }) as ColumnDef<DayWorkType>
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
            }) as ColumnDef<DayWorkType>
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
            }) as ColumnDef<DayWorkType>
        );

         if (isDnd) {
            return commonColumn;
        }

        return [TableCheckbox<DayWorkType>(columnHelper), ...commonColumn];
    }, [isDnd,meta,data]);
    
    // ブロックvalue04の合計を算出
    const calculateTotal = (blocks: BaseBlockEntityType[]) => {
        return blocks.reduce((sum, block) => {
            const value04 = block.value04;
            if (typeof value04 === 'string') {
                return sum + (parseFloat(value04) || 0);
            }
            return sum;
        }, 0);
    };
    
    // 当月の合計を算出
    const [allTotal, setAllTotal] = useState(0);
    const calculateAllTotal = (data: DayWorkType[]) => {
        return parseFloat(data.reduce((allSum, item) => {
            const blocks = item.blocks || [];
            return allSum + blocks.reduce((sum, block) => {
                const value04 = block.value04;
                if (typeof value04 === 'string') {
                    return sum + (parseFloat(value04) || 0);
                }
                return sum;
            }, 0);
        }, 0).toFixed(1)); // 小数点以下1桁まで四捨五入
    };

    useEffect(() => {
        if (data && data.data) {
            const total = calculateAllTotal(data.data);
            setAllTotal(total);
        }
    }, [data]);

    useEffect(() => {
        const param = getContentsFilter();
        if (param) {
            const queryString = Object.keys(param)
                .filter((key) => key !== "page" && key !== "limit")
                .map((key) => key + "=" + param[key])
                .join("&");
            if (queryString) {
                setcsvLink(`${initialCsvLink}?${queryString}`);
            }
        }
    }, [getContentsFilter, initialCsvLink]);

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
            <FormProvider>
                <Search />
            </FormProvider>

            <SimpleGrid columns={2} w="25%" alignItems="flex-end" spacing={4}>
                {/* <FormControl>
                    <FormLabel htmlFor="dnd">並び替え</FormLabel>
                    <Switch
                        colorScheme="teal"
                        size="lg"
                        id="dnd"
                        onChange={setIsDnd.toggle}
                    />
                </FormControl> */}
                <PageLimitSelect
                    pageLimit={pageLimit}
                    setPageLimit={setPageLimit}
                />
                <Box
                    border="2px"
                    borderColor="gray.200"
                    p={4}
                    borderRadius="md"
                    bg="gray.50"
                    textAlign="center"
                >
                    <Text fontSize="xl" fontWeight="bold">
                        合計: {allTotal}
                    </Text>
                </Box>
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

                  isCsvDownload={true}
                  csvDownloadLink={csvLink}
              />
            )}
        </Box>
    );
};

export default Index;
