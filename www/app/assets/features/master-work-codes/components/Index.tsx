import React, { useEffect } from "react";
import { PaginationTable, TableCheckbox } from "@/components/elements/Table";
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
import { useMasterWorkCodes } from "../api/getMasterWorkCodes";
import {
    MasterWorkCodeType,
    MasterWorkCodeFilterParamType,
    MasterWorkCodeFormValuesType,
} from "../types";
import { SubmitHandler } from "react-hook-form";
import { useCreateMasterWorkCode } from "../api/createMasterWorkCode";

import { GenerateFields } from "@/components/Form/GenerateFields";
import {  masterWorkCodesFields, masterWorkCodesModel } from "../api/schema";

import { BaseForm } from "@/components/Form/BaseForm";
import { StatusCell } from "@/features/misc/components/StatusCell";
import { FormProvider } from "@/providers/form";
import Search from "./Search";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";
import { useUpdateMasterWorkCode } from "../api/updateMasterWorkCode";
import { EditableCell } from "@/components/elements/Misc/EditerbleCell";

import { useMasterWorkCodeMeta } from "../api/getMasterWorkCodeMeta";
 
import { OnDragEndResponder } from "@hello-pangea/dnd";
import { DndTable } from "@/components/elements/Table/DndTable";
 
import PageLimitSelect from "@/components/elements/Misc/PageLimitSelect";

import { adminPrefix } from "@/config"; 

const Index = () => {
    const {
        getContentsFilter,
        pageNumber,
        setPagination,
        pageLimit,
        setPageLimit,
    } = useFilterParams();

    const { data, isLoading, isFetching } = useMasterWorkCodes({
        filters: getContentsFilter(),
    });

    const [isDnd, setIsDnd] = useBoolean();

    const initialCsvLink = `${adminPrefix}api/master-work-codes/csv-download`;
    const [csvLink, setcsvLink] = useState<string>(initialCsvLink);

    const [rowSelection, setRowSelection] = useState({});

    const createMutation = useCreateMasterWorkCode();

    const updateMutation = useUpdateMasterWorkCode();

    const { data: meta } = useMasterWorkCodeMeta();

    const columnHelper = createColumnHelper<MasterWorkCodeType>();

    const columns = useMemo<ColumnDef<MasterWorkCodeType>[]>(() => {
         const commonColumn = [];
        commonColumn.push(
            columnHelper.accessor("cid", {
                id: "cid",
                cell: (info) => {
                    return info.getValue();
                },
                header: () => <span>ID</span>,
            }) as ColumnDef<MasterWorkCodeType>
        );
        commonColumn.push(
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
                header: () => <span>作業内容</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<MasterWorkCodeType>
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
            }) as ColumnDef<MasterWorkCodeType>
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
            }) as ColumnDef<MasterWorkCodeType>
        );

        if (isDnd) {
            return commonColumn;
        }
        return [TableCheckbox<MasterWorkCodeType>(columnHelper), ...commonColumn];
    }, [ isDnd,meta, data]);

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

    const createOnSubmit: SubmitHandler<MasterWorkCodeFormValuesType> = async (
        values
    ) => {
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

    const elements = GenerateFields<MasterWorkCodeFormValuesType>({
        model: masterWorkCodesModel,
        fields: masterWorkCodesFields,
        meta: meta,
    });

    return (
        <Box>
            <FormProvider>
                <BaseForm<MasterWorkCodeFormValuesType>
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
                //   isCsvDownload={true}
                //   csvDownloadLink={csvLink}
              />
            )}

        </Box>
    );
};

export default Index;
