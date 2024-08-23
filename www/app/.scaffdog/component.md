---
name: 'component'
root: 'assets/'
output: './'
ignore: []
questions:
  component: '単数形のケバブケースで作成するコンポーネント名を入力してください'
  title: 'ページタイトルを入力してください'
  formType:
    message: 'フォームのタイプを選択してください(デフォルトは「ブロック有」)'
    choices:
      - 'ブロック有'
      - 'ブロック無'
      - '一覧ページに設置する'
    initial: 'ブロック有'
  confirmPage:
    if: contains("ブロック有, ブロック無",inputs.formType)
    message: '確認画面のタイプを選択してください(デフォルトは「公開側のレンダリング結果を利用」)'
    choices:
      - '公開側のレンダリング結果を利用'
      - '管理画面に表示'
      - '確認画面を利用しない'
    initial: '公開側のレンダリング結果を利用'
  option:
    message: '必要な機能を選択してください(複数可)'
    choices:
      - 'カテゴリ等マスタデータの利用'
      - 'オブジェクトによるフォーム生成の利用'
      - '承認処理'
      - '多言語対応'
    #   - 'CSVアップロード(モーダルフォーム)'
    #   - 'CSVダウンロード(モーダルフォーム)'
      - 'CSVダウンロード(リンク)'
      - 'アクセシビリティチェック'
      - '並び替え'
      - 'ページング件数変更'
      - 'サブディレクトリへの設置'
    multiple: true
    initial: []
  subdir:
    if: contains(inputs.option, 'サブディレクトリへの設置')
    message: 'サブディレクトリ名を入力してください(スラッシュ無し)'
---

# Variables

- dirname: {{ inputs.component | plur }}
- subdirname : `{{ if len(inputs.subdir) > 0 }}{{ inputs.subdir }}/{{ end }}`
- pageTitle : {{ inputs.title }}
- entityName: {{ inputs.component | pascal }}
- modelName: {{ inputs.component | plur | pascal }}
- dataFields: `{{ inputs.component | plur | camel }}Fields`
- dataModel: `{{ inputs.component | plur | camel }}Model`
- BaseType: `{{ entityName }}Type`
- BaseListType: `{{ entityName }}ListType`
- FormValueType: `{{ entityName }}FormValuesType`
- FilterParamType: `{{ entityName }}FilterParamType`
- MetaType: `{{ entityName }}MetaType`
- useDatas: `use{{ modelName }}`
- getDatasFilename: `get{{ modelName }}`
- useData: `use{{ entityName }}`
- getDataFilename: `get{{ entityName }}`
- useCreateData: `useCreate{{ entityName }}`
- createDataFilename: `create{{ entityName }}`
- CreateDataType: `Create{{ entityName }}Type`
- useConfirmData: `useConfirm{{ entityName }}`
- confirmDataFilename: `confirm{{ entityName }}`
- ConfirmDataType: `Confirm{{ entityName }}Type`
- useUpdateData: `useUpdate{{ entityName }}`
- updateDataFilename: `update{{ entityName }}`
- UpdateDataType: `Update{{ entityName }}Type`
- useMetadata: `use{{ entityName }}Meta`
- metadataFilename: `get{{ entityName }}Meta`

{{ /* index */ }}


# `features/{{ dirname }}/index.ts`

```ts
export * from "./types";
```

{{ /* 型定義ファイル */ }}

# `features/{{ dirname }}/types/index.ts`

```ts
import {
    BaseBlockEntityType,
    BaseEntityType,
    CommonFilterParamType,
    IgnoreFormFieldsType,
    ResoponseCollectionType,
    MetadataType,
    {{ if contains(inputs.option, '承認処理') }}
    ApprovalRemandType,
    {{ end }}
    {{ if contains(inputs.option, 'カテゴリ等マスタデータの利用') }}MetaUtilityType,{{ end }}
} from "@/types";

/**
 * 追加していく
 */
export type {{ BaseType }} = {
    title: string;
    published: string;
    start_date: string;
    end_date: string;
    {{ if inputs.formType == 'ブロック有' }}
    blocks: BaseBlockEntityType[];
    metadata?: MetadataType | null;
    {{ end }}
    {{ if contains(inputs.option, '並び替え') }}sequence: number;{{ end }}
     {{ if contains(inputs.option, '承認処理') }}
    approval_remands: ApprovalRemandType[];
     {{ end }}
      {{ if contains(inputs.option, '多言語対応') }}
    _translations?: Record<string, Omit<{{ BaseType }}, "_translations">>;
      {{ end}}
} & BaseEntityType;

export type {{ BaseListType }} = {
    data: {{ BaseType }}[];
    collection: ResoponseCollectionType;
};

/**
 * 調整の必要があれば
 */
export type {{ FormValueType }} = Omit<{{ BaseType }}, IgnoreFormFieldsType>;

/**
 * 追加していく
 *
 * 例
 * {model? : string } & CommonFilterParamType
 *
 */
export type {{ FilterParamType }} = CommonFilterParamType;
{{ if contains(inputs.option, 'カテゴリ等マスタデータの利用') }}
/**
 * 追加していく
 *
 * 例
 * {master_category : BaseSelectOptions[] } & MetaUtilityType
 *
 */
export type {{ MetaType }} = MetaUtilityType;
{{ end }}

```

{{ /* コンポーネント */ }}

# `{{ inputs.formType == 'ブロック有' || inputs.formType == 'ブロック無' || '!' }}features/{{ dirname }}/components/Index.tsx`

```tsx
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
    {{ if contains(inputs.option, '多言語対応') }} ExpandedState,{{ end }}
    getCoreRowModel,
    {{ if contains(inputs.option, '多言語対応') }} getExpandedRowModel,{{ end }}
    getFilteredRowModel,
    {{ if contains(inputs.option, '多言語対応') }} Row,{{ end }}
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { {{ useDatas }} } from "../api/{{ getDatasFilename }}";
import { {{ BaseType }} } from "../types";
{{ if inputs.confirmPage == '公開側のレンダリング結果を利用' }}import { PreviewCell } from "@/features/misc/components/PreviewCell";{{ end }}
import { StatusCell } from "@/features/misc/components/StatusCell";
import { DatePeriodCell } from "@/features/misc/components/DatePeriodCell";
import { FormProvider } from "@/providers/form";
import Search from "./Search";
import { CrudLinkCell } from "@/features/misc/components/CrudLinkCell";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";
{{ if contains(inputs.option, 'CSVダウンロード(リンク)') }}
import { adminPrefix } from "@/config";
{{ end }}
 {{ if contains(inputs.option, 'ページング件数変更') }}
import PageLimitSelect from "@/components/elements/Misc/PageLimitSelect";
{{ end }}
{{ if contains(inputs.option, 'カテゴリ等マスタデータの利用') }}
import { {{ useMetadata }} } from "../api/{{ metadataFilename }}";
{{ end }}
 {{ if contains(inputs.option, '並び替え') }}
import { {{ useUpdateData }} } from "../api/{{ updateDataFilename }}";
import { OnDragEndResponder } from "@hello-pangea/dnd";
import { DndTable } from "@/components/elements/Table/DndTable";
{{ end }}
 {{ if contains(inputs.option, '承認処理') }}
import RemandCell from "@/components/elements/Misc/RemandCell";
{{ end }}
 {{ if contains(inputs.option, '多言語対応') }}
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useLocaleSetting } from "@/features/misc/api/getLocaleSettings";
import { defaultLocale } from "@/config";
{{ end }}

const Index = () => {
    const {
        getContentsFilter,
        pageNumber,
        setPagination,
        pageLimit,
        setPageLimit,
    } = useFilterParams();

    const { data, isLoading, isFetching } = {{ useDatas }}({
        filters: getContentsFilter(),
    });

{{ if contains(inputs.option, 'カテゴリ等マスタデータの利用') }}
    const { data: meta } = {{ useMetadata }}();
{{ end }}

    {{ if contains(inputs.option, '並び替え') }}
      const [isDnd, setIsDnd] = useBoolean();
    {{ end }}


    {{ if contains(inputs.option, 'CSVダウンロード(リンク)') }}
      const initialCsvLink = `${adminPrefix}api/{{ dirname }}/csv-download`;
      const [csvLink, setcsvLink] = useState<string>(initialCsvLink);
    {{ end }}

    const [rowSelection, setRowSelection] = useState({});

{{ if contains(inputs.option, '並び替え') }}
    const updateMutation = {{ useUpdateData }}();
{{ end }}

    {{ if contains(inputs.option, '多言語対応') }}
        const { data: localeSetting } = useLocaleSetting();

        const locales = localeSetting?.locales || [];

        const [expanded, setExpanded] = useState<ExpandedState>({});

        const rowSpan = locales.length <= 0 ? 1 : locales.length;
    {{ end }}

    const columnHelper = createColumnHelper<{{ BaseType }}>();

    const columns = useMemo<ColumnDef<{{ BaseType }}>[]>(() => {
        const commonColumn = [];

        commonColumn.push(
            columnHelper.accessor("cid", {
                id: "cid",
                cell: (info) => {
                    return info.getValue();
                },
                header: () => <span>ID</span>,
                {{ if contains(inputs.option, '多言語対応') }}
                meta: {
                    tdProps: {
                        rowSpan: rowSpan,
                    },
                },
                {{ end }}
            }) as ColumnDef<{{ BaseType }}>
        );
         {{ if contains(inputs.option, '多言語対応') }}
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
            }) as ColumnDef<{{ BaseType }}>
        );
         }
        {{ end }}
         commonColumn.push(
            columnHelper.accessor("title", {
                id: "title",
                cell: (info) => {
                     {{ if contains(inputs.option, '多言語対応') }}
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
                    {{ end }}

                    return (
                        <CrudLinkCell id={info.row.original.id}>
                            {info.getValue()}
                        </CrudLinkCell>
                    );
                },
                header: () => <span>タイトル</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<{{ BaseType }}>
        );
         {{ if contains(inputs.option, '承認処理') }}
          commonColumn.push(
            columnHelper.accessor("modified_admin", {
                id: "modified_admin",
                cell: (info) => {
                    const data = info.getValue();
                    {{ if contains(inputs.option, '多言語対応') }}
                    const isForegin = info.row.original.locale !== undefined;

                    if (isForegin) {
                        return "-";
                    }
                    {{ end }}

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
            }) as ColumnDef<{{ BaseType }}>
        );
        {{ end }}
        commonColumn.push(
            columnHelper.accessor("published", {
                id: "published",
                cell: (info) => {
                    const data = info.getValue();
                     {{ if contains(inputs.option, '多言語対応') }}
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
                    {{ end }}

                    if (data) {
                        return <>{data}</>;
                    }
                },
                header: () => <span>公開日</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<{{ BaseType }}>
        );
         commonColumn.push(
            columnHelper.accessor(
                (row) => {
                    return { startDate: row.start_date, endDate: row.end_date };
                },
                {
                    id: "publicPeriod",
                    cell: (info) => {
                        {{ if contains(inputs.option, '多言語対応') }}
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
                        {{ end }}
                        return <DatePeriodCell {...info.getValue()} />;
                    },
                    header: () => <span>公開期間</span>,
                    // footer: (info) => info.column.id,
                }
            ) as ColumnDef<{{ BaseType }}>
        );
         commonColumn.push(
            columnHelper.accessor("modified", {
                id: "modified",
                cell: (info) => {
                    const data = info.getValue();

                    {{ if contains(inputs.option, '多言語対応') }}
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
                    {{ end }}

                    if (data) {
                        return <>{data}</>;
                    }
                },
                header: () => <span>最終更新日時</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<{{ BaseType }}>
        );
        commonColumn.push(
            columnHelper.accessor("status", {
                id: "status",
                cell: (info) => {
                    const data = info.getValue();
                     {{ if contains(inputs.option, '多言語対応') }}
                    const isForegin = info.row.original.locale !== undefined;

                    if (isForegin) {
                        const isTranslation = info.row.original.is_translation;

                        if (!isTranslation) {
                            return "-";
                        }
                        return <StatusCell status={data} />;
                    }
                    {{ end }}

                    return <StatusCell status={data} />;
                },
                header: () => <span>ステータス</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<{{ BaseType }}>
        );
        commonColumn.push(
            columnHelper.accessor("public", {
                id: "public",
                cell: (info) => {
                    const data = info.getValue();
                    {{ if contains(inputs.option, '多言語対応') }}
                    const isForegin = info.row.original.locale !== undefined;

                    if (isForegin) {
                        const isTranslation = info.row.original.is_translation;

                        if (!isTranslation) {
                            return "-";
                        }
                        return <StatusCell status={data} />;
                    }
                    {{ end }}

                    return <StatusCell status={data} />;
                },
                header: () => <span>公開状態</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<{{ BaseType }}>
        );
        {{ if inputs.confirmPage == '公開側のレンダリング結果を利用' }}
        commonColumn.push(
            columnHelper.display({
                id: "actions",
                header: () => <span>プレビュー</span>,
                cell: (info) => {
                    {{ if contains(inputs.option, '多言語対応') }}
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
                    {{ end }}

                    return <PreviewCell id={info.row.original.id} />;
                },
            }) as ColumnDef<{{ BaseType }}>
        );
        {{ end }}

        {{ if contains(inputs.option, '承認処理') }}
        commonColumn.push(
            columnHelper.accessor("create_admin", {
                id: "create_admin",
                cell: (info) => {
                    {{ if contains(inputs.option, '多言語対応') }}
                    const isForegin = info.row.original.locale !== undefined;

                    if (isForegin) {
                        return "-";
                    }
                    {{ end }}

                    const data = info.getValue();
                    if (data) {
                        return <>{data.title}</>;
                    }
                },
                header: () => <span>作成者</span>,
                {{ if contains(inputs.option, '多言語対応') }}
                meta: {
                    tdProps: {
                        rowSpan: rowSpan,
                    },
                },
                {{ end }}
                // footer: (info) => info.column.id,
            }) as ColumnDef<{{ BaseType }}>
        );
        {{ end }}

           commonColumn.push(
            columnHelper.accessor("created", {
                id: "created",
                cell: (info) => {
                    const data = info.getValue();
                    {{ if contains(inputs.option, '多言語対応') }}
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
                    {{ end }}
                    if (data) {
                        return <>{data}</>;
                    }
                },
                header: () => <span>作成日時</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<{{ BaseType }}>
        );

        {{ if contains(inputs.option, '承認処理') }}
         commonColumn.push(
                columnHelper.display({
                    id: "remand",
                    cell: (info) => {
                        {{ if contains(inputs.option, '多言語対応') }}
                        const isForegin =
                            info.row.original.locale !== undefined;

                        if (isForegin) {
                            return "-";
                        }
                        {{ end }}

                        return (
                            <RemandCell
                                approval_remands={
                                    info.row.original.approval_remands
                                }
                            />
                        );
                    },
                    header: () => <span>差戻し履歴</span>,
                }) as ColumnDef<{{ BaseType }}>
            );

        {{ end }}

      {{ if contains(inputs.option, '並び替え') }}
         if (isDnd) {
            return commonColumn;
        }
      {{ end }}
        return [TableCheckbox<{{ BaseType }}>(columnHelper), ...commonColumn];
    }, [{{ if contains(inputs.option, '並び替え') }}isDnd,{{ end }}{{ if contains(inputs.option, '多言語対応') }}locales,{{ end }}{{ if contains(inputs.option, 'カテゴリ等マスタデータの利用') }}meta,{{end}}data]);

     {{ if contains(inputs.option, 'CSVダウンロード(リンク)') }}
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
     {{ end }}

  {{ if contains(inputs.option, 'ページング件数変更') || contains(inputs.option, '並び替え') }}
      {{ if contains(inputs.option, 'ページング件数変更') && contains(inputs.option, '並び替え') }}
        useEffect(() => {
            setRowSelection({});
        }, [pageNumber, isDnd, pageLimit]);
      {{ else if contains(inputs.option, 'ページング件数変更') }}
        useEffect(() => {
            setRowSelection({});
        }, [pageNumber, pageLimit]);

      {{ else if contains(inputs.option, '並び替え') }}
        useEffect(() => {
            setRowSelection({});
        }, [pageNumber, isDnd]);
      {{ end }}

  {{ else }}

    useEffect(() => {
        setRowSelection({});
    }, [pageNumber]);

  {{ end }}

  {{ if contains(inputs.option, '多言語対応') }}
    const localeTableOptions = {
        getSubRows: (row: {{ BaseType }}) => {
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
        enableRowSelection: (row: Row<{{ BaseType }}>) => {
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
    {{ end }}

    const table = useReactTable({
        data: data?.data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            rowSelection,
            {{ if contains(inputs.option, '多言語対応') }}expanded,{{ end }}
        },
        onRowSelectionChange: setRowSelection,
        manualPagination: true,
        getFilteredRowModel: getFilteredRowModel(),
        {{ if contains(inputs.option, '多言語対応') }}...localeTableOptions,{{ end }}
    });

    const collection = data?.collection;

    {{ if contains(inputs.option, '並び替え') }}
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
    {{ end }}

    return (
        <Box>
            <Button as={RouterLink} to={"./crud"} bg="cyan.800" color="white">
                新規登録
            </Button>
            <FormProvider>
                <Search />
            </FormProvider>

            {{ if contains(inputs.option, 'ページング件数変更') || contains(inputs.option, '並び替え') }}
            <SimpleGrid columns={2} w="25%">
                {{ if contains(inputs.option, '並び替え')}}
                <FormControl>
                    <FormLabel htmlFor="dnd">並び替え</FormLabel>
                    <Switch
                        colorScheme="teal"
                        size="lg"
                        id="dnd"
                        onChange={setIsDnd.toggle}
                    />
                </FormControl>
                {{ end }}
                {{ if contains(inputs.option, 'ページング件数変更')}}
                <PageLimitSelect
                    pageLimit={pageLimit}
                    setPageLimit={setPageLimit}
                />
                {{ end }}
            </SimpleGrid>
            {{ end }}

        {{ if contains(inputs.option, '並び替え')}}
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
                   {{ if contains(inputs.option, 'CSVダウンロード(リンク)') }}
                  isCsvDownload={true}
                  csvDownloadLink={csvLink}
                   {{ end }}
              />
            )}

        {{ else }}
             <PaginationTable
                  table={table}
                  collection={collection}
                  setPagination={setPagination}
                  pageNumber={pageNumber}
                  isLoading={isLoading}
                   {{ if contains(inputs.option, 'CSVダウンロード(リンク)') }}
                  isCsvDownload={true}
                  csvDownloadLink={csvLink}
                   {{ end }}
              />
        {{ end }}
        </Box>
    );
};

export default Index;

```

# `{{ inputs.formType == '一覧ページに設置する' || '!' }}features/{{ dirname }}/components/Index.tsx`

```tsx
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
    {{ if contains(inputs.option, '多言語対応') }} ExpandedState,{{ end }}
    getCoreRowModel,
    {{ if contains(inputs.option, '多言語対応') }} getExpandedRowModel,{{ end }}
    getFilteredRowModel,
    {{ if contains(inputs.option, '多言語対応') }} Row,{{ end }}
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { {{ useDatas }} } from "../api/{{ getDatasFilename }}";
import {
    {{ BaseType }},
    {{ FilterParamType }},
    {{ FormValueType }},
} from "../types";
import { SubmitHandler } from "react-hook-form";
import { {{ useCreateData }} } from "../api/{{ createDataFilename }}";
{{ if contains(inputs.option, 'オブジェクトによるフォーム生成の利用') }}
import { GenerateFields } from "@/components/Form/GenerateFields";
import {  {{ dataFields }}, {{ dataModel }} } from "../api/schema";
{{ else }}
import {  {{ dataModel }} } from "../api/schema";
{{ end }}
import { BaseForm } from "@/components/Form/BaseForm";
import { StatusCell } from "@/features/misc/components/StatusCell";
import { FormProvider } from "@/providers/form";
import Search from "./Search";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";
import { {{ useUpdateData }} } from "../api/{{ updateDataFilename }}";
import { EditableCell } from "@/components/elements/Misc/EditerbleCell";
{{ if contains(inputs.option, 'カテゴリ等マスタデータの利用') }}
import { {{ useMetadata }} } from "../api/{{ metadataFilename }}";
{{ end }}
 {{ if contains(inputs.option, '並び替え') }}
import { OnDragEndResponder } from "@hello-pangea/dnd";
import { DndTable } from "@/components/elements/Table/DndTable";
{{ end }}
 {{ if contains(inputs.option, 'ページング件数変更') }}
import PageLimitSelect from "@/components/elements/Misc/PageLimitSelect";
{{ end }}
 {{ if contains(inputs.option, '承認処理') }}
import RemandCell from "@/components/elements/Misc/RemandCell";
{{ end }}
 {{ if contains(inputs.option, '多言語対応') }}
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useLocaleSetting } from "@/features/misc/api/getLocaleSettings";
import { defaultLocale } from "@/config";
{{ end }}

const Index = () => {
    const {
        getContentsFilter,
        pageNumber,
        setPagination,
        pageLimit,
        setPageLimit,
    } = useFilterParams();

    const { data, isLoading, isFetching } = {{ useDatas }}({
        filters: getContentsFilter(),
    });

    {{ if contains(inputs.option, '並び替え') }}
      const [isDnd, setIsDnd] = useBoolean();
    {{ end }}

    {{ if contains(inputs.option, 'CSVダウンロード(リンク)') }}
      const initialCsvLink = `${adminPrefix}api/{{ dirname }}/csv-download`;
      const [csvLink, setcsvLink] = useState<string>(initialCsvLink);
    {{ end }}

    const [rowSelection, setRowSelection] = useState({});

    {{ if contains(inputs.option, '多言語対応') }}
        const { data: localeSetting } = useLocaleSetting();

        const locales = localeSetting?.locales || [];

        const [expanded, setExpanded] = useState<ExpandedState>({});

        const rowSpan = locales.length <= 0 ? 1 : locales.length;
    {{ end }}

    const createMutation = {{ useCreateData }}();

    const updateMutation = {{ useUpdateData }}();

{{ if contains(inputs.option, 'カテゴリ等マスタデータの利用') }}
    const { data: meta } = {{ useMetadata }}();
{{ end }}

    const columnHelper = createColumnHelper<{{ BaseType }}>();

    const columns = useMemo<ColumnDef<{{ BaseType }}>[]>(() => {
         const commonColumn = [];
        commonColumn.push(
            columnHelper.accessor("cid", {
                id: "cid",
                cell: (info) => {
                    return info.getValue();
                },
                header: () => <span>ID</span>,
                 {{ if contains(inputs.option, '多言語対応') }}
                meta: {
                    tdProps: {
                        rowSpan: rowSpan,
                    },
                },
                {{ end }}
            }) as ColumnDef<{{BaseType}}>
        );
           {{ if contains(inputs.option, '多言語対応') }}
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
            }) as ColumnDef<{{BaseType}}>
        );
        }
        {{ end }}
         commonColumn.push(
            columnHelper.accessor("title", {
                id: "title",
                cell: (info) => {
                     {{ if contains(inputs.option, '多言語対応') }}
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
                    {{ end }}

                    return (
                        <CrudLinkCell id={info.row.original.id}>
                            {info.getValue()}
                        </CrudLinkCell>
                    );
                },
                header: () => <span>タイトル</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<{{BaseType}}>
        );
          commonColumn.push(
            columnHelper.accessor("public", {
                id: "public",
                cell: (info) => {
                    const data = info.getValue();
                     {{ if contains(inputs.option, '多言語対応') }}
                    const isForegin = info.row.original.locale !== undefined;

                    if (isForegin) {
                        const isTranslation = info.row.original.is_translation;

                        if (!isTranslation) {
                            return "-";
                        }
                        return <StatusCell status={data} />;
                    }
                    {{ end }}

                    return <StatusCell status={data} />;
                },
                header: () => <span>公開状態</span>,
                // footer: (info) => info.column.id,
            }) as ColumnDef<{{BaseType}}>
        );

        {{ if contains(inputs.option, '並び替え') }}
        if (isDnd) {
            return commonColumn;
        }
        {{ end }}

        return [TableCheckbox<{{ BaseType }}>(columnHelper), ...commonColumn];
    }, [ {{ if contains(inputs.option, '並び替え') }}isDnd,{{ end }}{{ if contains(inputs.option, '多言語対応') }}locales,{{ end }}{{ if contains(inputs.option, 'カテゴリ等マスタデータの利用') }}meta,{{end}} data]);

     {{ if contains(inputs.option, 'CSVダウンロード(リンク)') }}
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
     {{ end }}

    {{ if contains(inputs.option, 'ページング件数変更') || contains(inputs.option, '並び替え') }}
        {{ if contains(inputs.option, 'ページング件数変更') && contains(inputs.option, '並び替え') }}
          useEffect(() => {
              setRowSelection({});
          }, [pageNumber, isDnd, pageLimit]);
        {{ else if contains(inputs.option, 'ページング件数変更') }}
          useEffect(() => {
              setRowSelection({});
          }, [pageNumber, pageLimit]);

        {{ else if contains(inputs.option, '並び替え') }}
          useEffect(() => {
              setRowSelection({});
          }, [pageNumber, isDnd]);
        {{ end }}

    {{ else }}

      useEffect(() => {
          setRowSelection({});
      }, [pageNumber]);

    {{ end }}

 {{ if contains(inputs.option, '多言語対応') }}
    const localeTableOptions = {
        getSubRows: (row:  {{ BaseType }} ) => {
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
        enableRowSelection: (row: Row<{{ BaseType }}>) => {
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
{{ end }}

    const table = useReactTable({
        data: data?.data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            rowSelection,
            {{ if contains(inputs.option, '多言語対応') }} expanded, {{end}}
        },
        onRowSelectionChange: setRowSelection,
        manualPagination: true,
        getFilteredRowModel: getFilteredRowModel(),
         {{ if contains(inputs.option, '多言語対応') }} ...localeTableOptions, {{ end }}
    });

    const collection = data?.collection;

    const createOnSubmit: SubmitHandler<{{ FormValueType }}> = async (
        values
    ) => {
        const data = await createMutation.mutateAsync({ data: values });
    };

    {{ if contains(inputs.option, '並び替え') }}
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
    {{ end }}

   {{ if contains(inputs.option, 'オブジェクトによるフォーム生成の利用') }}
    const elements = GenerateFields<{{ FormValueType }}>({
        model: {{ dataModel }},
        fields: {{ dataFields }},
        {{ if contains(inputs.option, 'カテゴリ等マスタデータの利用') }}meta: meta,{{ end }}
    });
    {{ end }}

    return (
        <Box>
            <FormProvider>
                <BaseForm<{{ FormValueType }}>
                    onSubmit={createOnSubmit}
                    w="50%"
                >
                    {{ if contains(inputs.option, 'オブジェクトによるフォーム生成の利用') }}
                    {elements}
                    {{end }}
                    <Center mt="2">
                        <Button type="submit">登録</Button>
                    </Center>
                </BaseForm>
            </FormProvider>
            <FormProvider>
                <Search />
            </FormProvider>
               {{ if contains(inputs.option, 'ページング件数変更') || contains(inputs.option, '並び替え') }}
                <SimpleGrid columns={2} w="25%">
                    {{ if contains(inputs.option, '並び替え')}}
                    <FormControl>
                        <FormLabel htmlFor="dnd">並び替え</FormLabel>
                        <Switch
                            colorScheme="teal"
                            size="lg"
                            id="dnd"
                            onChange={setIsDnd.toggle}
                        />
                    </FormControl>
                    {{ end }}
                    {{ if contains(inputs.option, 'ページング件数変更')}}
                    <PageLimitSelect
                        pageLimit={pageLimit}
                        setPageLimit={setPageLimit}
                    />
                    {{ end }}
                </SimpleGrid>
              {{ end }}
         {{ if contains(inputs.option, '並び替え')}}
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
                   {{ if contains(inputs.option, 'CSVダウンロード(リンク)') }}
                  isCsvDownload={true}
                  csvDownloadLink={csvLink}
                   {{ end }}
              />
            )}

        {{ else }}
               <PaginationTable
                  table={table}
                  collection={collection}
                  setPagination={setPagination}
                  pageNumber={pageNumber}
                  isLoading={isLoading}
                   {{ if contains(inputs.option, 'CSVダウンロード(リンク)') }}
                  isCsvDownload={true}
                  csvDownloadLink={csvLink}
                   {{ end }}
              />
        {{ end }}
        </Box>
    );
};

export default Index;

```

# `features/{{ dirname }}/components/Search.tsx`

```tsx
import React, { useEffect } from "react";
import { Input, Select } from "@chakra-ui/react";

import { {{ FilterParamType }} } from "../types";
{{ if contains(inputs.option, 'カテゴリ等マスタデータの利用') }}
import { {{ useMetadata }} } from "../api/{{ metadataFilename }}";
{{ end }}
import { useFormContext } from "react-hook-form";
import { BaseSearchForm } from "@/components/Form/BaseSearchForm";
import { BaseFieldWrapper } from "@/components/Form/BaseFieldWrapper";
import { useStatusOptions } from "@/features/misc/hooks/useStatusOptions";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";


const Search = () => {
    const { getContentsFilter, setContentsFilter, setPagination } =
        useFilterParams();
    const statusOptions = useStatusOptions({ forSearch: true });

  {{ if contains(inputs.option, 'カテゴリ等マスタデータの利用') }}
      const { data: meta } = {{ useMetadata }}();
  {{ end }}

    const { register, reset } = useFormContext<{{ FilterParamType }}>();

    const defaultValue = getContentsFilter();

    useEffect(() => {
        if (defaultValue) {
            reset(defaultValue);
        }
    }, [defaultValue]);


    return (
        <BaseSearchForm<{{ FilterParamType }}>
           onSubmit={async (values) => {
                setContentsFilter({ ...values, page: 1 });
                setPagination(1);
            }}
        >
            <BaseFieldWrapper label="キーワード">
                <Input {...register("q")} />
            </BaseFieldWrapper>
            <BaseFieldWrapper label="公開状態">
                <Select placeholder="---" {...register("public")} w="72">
                    {statusOptions &&
                        statusOptions
                            .filter(
                                (item) =>
                                    item.status === "published" ||
                                    item.status === "unpublished"
                            )
                            .map((item) => (
                                <option key={item.status} value={item.status}>
                                    {item.title}
                                </option>
                            ))}
                </Select>
            </BaseFieldWrapper>
            <BaseFieldWrapper label="ステータス">
                <Select placeholder="---" {...register("status")} w="72">
                    {statusOptions &&
                        statusOptions.map((item) => (
                            <option key={item.status} value={item.status}>
                                {item.title}
                            </option>
                        ))}
                </Select>
            </BaseFieldWrapper>
        </BaseSearchForm>
    );
};

export default Search;

```

# `{{ inputs.formType == 'ブロック有' || inputs.formType == 'ブロック無' || '!' }}features/{{ dirname }}/components/Create.tsx`

```tsx
import React from "react";
import { {{ useCreateData }} } from "../api/{{ createDataFilename }}";
{{ if inputs.confirmPage == '公開側のレンダリング結果を利用' ||  inputs.confirmPage == '管理画面に表示' }}
import { {{ useConfirmData }} } from "../api/{{ confirmDataFilename }}";
import { useNavigate } from "react-router-dom";
{{ end }}
import { {{ FormValueType }} } from "../types";
{{ if contains(inputs.option, 'カテゴリ等マスタデータの利用') }}
import { {{ useMetadata }} } from "../api/{{ metadataFilename }}";
{{ end }}

import { useBoolean, useDisclosure } from "@chakra-ui/react";
{{ if contains(inputs.option, 'オブジェクトによるフォーム生成の利用') }}
import { GenerateFields } from "@/components/Form/GenerateFields";
import { {{ dataFields }}, {{ dataModel }} } from "../api/schema";
{{ else }}
import Form from "./Form";
import { {{ dataModel }} } from "../api/schema";
{{ end }}
import { SubmitHandler, useFormContext } from "react-hook-form";
import { useState } from "react";
import { ResponseValidationType } from "@/types";
import { AxiosError } from "axios";
{{ if inputs.confirmPage == '公開側のレンダリング結果を利用' }}
import { FormWithPublicViewConfirm } from "@/components/Form/FormWithPublicViewConfirm";
{{ else if inputs.confirmPage == '管理画面に表示' }}
import { FormWithConfirm } from "@/components/Form/FormWithConfirm";
{{ else }}
import { FormWithoutConfirm } from "@/components/Form/FormWithoutConfirm";
{{ end }}
import { useContentsKey } from "@/features/misc/hooks/useContentsKey";
import { adminPrefix } from "@/config";

const Create = () => {
    const mutation = {{ useCreateData }}();
{{ if inputs.confirmPage == '公開側のレンダリング結果を利用' ||  inputs.confirmPage == '管理画面に表示' }}
    const confirmMutation =  {{ useConfirmData }}();
{{ end }}

    const { setError } = useFormContext();

{{ if inputs.confirmPage == '公開側のレンダリング結果を利用' }}
    const [html, setHtml] = useState("");
{{ end }}

{{ if inputs.confirmPage == '公開側のレンダリング結果を利用' ||  inputs.confirmPage == '管理画面に表示' }}
    const [isValid, setValid] = useBoolean();
    const [isConfirm, setConfirm] = useBoolean();
{{ end }}

{{ if inputs.confirmPage == '公開側のレンダリング結果を利用' }}
    const modalAction = useDisclosure();
{{ end }}

{{ if inputs.confirmPage == '公開側のレンダリング結果を利用' ||  inputs.confirmPage == '管理画面に表示' }}
    const navigate = useNavigate();
    const contentsKey = useContentsKey();
{{ end }}

{{ if contains(inputs.option, 'カテゴリ等マスタデータの利用') }}
    const { data: meta } = {{ useMetadata }}();
{{ end }}


    const onSubmit: SubmitHandler<{{ FormValueType }}> = async (values) => {
{{ if inputs.confirmPage == '公開側のレンダリング結果を利用' ||  inputs.confirmPage == '管理画面に表示' }}
        if (isValid && isConfirm) {
            const data = await mutation.mutateAsync({ data: values });

            navigate(`${adminPrefix}${contentsKey}`);

        } else {
{{ end }}
            try {

{{ if inputs.confirmPage == '公開側のレンダリング結果を利用' }}
                const data = await confirmMutation.mutateAsync({
                    data: values,
                });
                if (data.status) {
                    setValid.on();
                    setConfirm.on();
                    if (data.view) {
                        setHtml(data.view);
                        modalAction.onOpen();
                    }
                }
{{ else if inputs.confirmPage == '管理画面に表示' }}
               const data = await confirmMutation.mutateAsync({
                    data: values,
                });
                if (data.status) {
                    setValid.on();
                    setConfirm.on();
                }
{{ else }}
               const data = await mutation.mutateAsync({
                  data: values,
              });
{{ end }}

            } catch (e) {
                if (e instanceof AxiosError) {
                    if (e.response?.status === 422) {
                        const errorMessages: ResponseValidationType =
                            e.response.data.error;

                        for (const [key, value] of Object.entries(
                            errorMessages
                        )) {
                            setError(key, { types: value });
                        }
                    }
                }
            }
{{ if inputs.confirmPage == '公開側のレンダリング結果を利用' ||  inputs.confirmPage == '管理画面に表示' }}
        }
{{ end }}
    };

{{ if contains(inputs.option, 'オブジェクトによるフォーム生成の利用') }}
    const elements = GenerateFields({
        model: {{ dataModel }},
        fields: {{ dataFields }},
        {{ if inputs.confirmPage == '公開側のレンダリング結果を利用' ||  inputs.confirmPage == '管理画面に表示' }}isConfirm: isConfirm,{{ end }}
        {{ if contains(inputs.option, 'カテゴリ等マスタデータの利用') }}meta: meta,{{ end }}
    });
{{ end }}

    return (
        {{ if inputs.confirmPage == '公開側のレンダリング結果を利用' }}
        <FormWithPublicViewConfirm<{{ FormValueType }}>
            onSubmit={onSubmit}
            isLoading={mutation.isLoading}
            isEdit={false}
            isConfirm={isConfirm}
            setConfirm={setConfirm}
            setValid={setValid}
            modalAction={modalAction}
            html={html}
           {{ if contains(inputs.option, 'アクセシビリティチェック') }}
             isAccessibility={true}
             {{ end }}
        >
             {{ if contains(inputs.option, 'オブジェクトによるフォーム生成の利用') }}
                {elements}
             {{ else }}
                    <Form model={ {{- dataModel -}} } isConfirm={isConfirm} />
             {{ end }}
        </FormWithPublicViewConfirm>
        {{ else if inputs.confirmPage == '管理画面に表示' }}
         <FormWithConfirm<{{ FormValueType }}>
            onSubmit={onSubmit}
            isLoading={mutation.isLoading}
            isEdit={false}
            isConfirm={isConfirm}
            setConfirm={setConfirm}
            isConfirmLoading={confirmMutation.isLoading}
           {{ if contains(inputs.option, 'アクセシビリティチェック') }}
             isAccessibility={true}
             {{ end }}
        >
             {{ if contains(inputs.option, 'オブジェクトによるフォーム生成の利用') }}
                {elements}
             {{ else }}
                    <Form model={ {{- dataModel -}} } isConfirm={isConfirm} />
             {{ end }}
        </FormWithConfirm>
        {{ else }}
        <FormWithoutConfirm<{{ FormValueType }}>
            onSubmit={onSubmit}
            isLoading={mutation.isLoading}
            isEdit={false}
           {{ if contains(inputs.option, 'アクセシビリティチェック') }}
             isAccessibility={true}
            {{ end }}
        >
             {{ if contains(inputs.option, 'オブジェクトによるフォーム生成の利用') }}
                {elements}
             {{ else }}
                    <Form model={ {{- dataModel -}} } />
             {{ end }}
        </FormWithoutConfirm>
        {{ end }}
    );
};

export default Create;

```

# `{{ inputs.formType == 'ブロック有' || inputs.formType == 'ブロック無' || '!' }}features/{{ dirname }}/components/Update.tsx`

```tsx
import React, { useEffect, useState } from "react";
import { {{ useUpdateData }} } from "../api/{{ updateDataFilename }}";
{{ if inputs.confirmPage == '公開側のレンダリング結果を利用' ||  inputs.confirmPage == '管理画面に表示' }}
import { {{ useConfirmData }} } from "../api/{{ confirmDataFilename }}";
import { useNavigate } from "react-router-dom";
{{ end }}
import { {{ useData }} } from "../api/{{ getDataFilename }}";
import { {{ FormValueType }} } from "../types";
{{ if contains(inputs.option, 'カテゴリ等マスタデータの利用') }}
import { {{ useMetadata }} } from "../api/{{ metadataFilename }}";
{{ end }}

import { useBoolean, useDisclosure } from "@chakra-ui/react";
{{ if contains(inputs.option, 'オブジェクトによるフォーム生成の利用') }}
import { GenerateFields } from "@/components/Form/GenerateFields";
import { {{ dataFields }}, {{ dataModel }} } from "../api/schema";
{{ else }}
import Form from "./Form";
import { {{ dataModel }} } from "../api/schema";
{{ end }}
import { SubmitHandler, useFormContext } from "react-hook-form";
import { ResponseValidationType } from "@/types";
import { AxiosError } from "axios";
{{ if inputs.confirmPage == '公開側のレンダリング結果を利用' }}
import { FormWithPublicViewConfirm } from "@/components/Form/FormWithPublicViewConfirm";
{{ else if inputs.confirmPage == '管理画面に表示' }}
import { FormWithConfirm } from "@/components/Form/FormWithConfirm";
{{ else }}
import { FormWithoutConfirm } from "@/components/Form/FormWithoutConfirm";
{{ end }}
import { useContentsKey } from "@/features/misc/hooks/useContentsKey";
import { adminPrefix  {{ if contains(inputs.option, '多言語対応') }}, defaultLocale{{ end }} } from "@/config";
{{ if contains(inputs.option, '多言語対応') }}
import { useFormBeforeUnload } from "@/features/misc/hooks/useFormBeforeUnload";
import { LocaleFormTab } from "@/components/elements/Misc/LocaleFormTab";
{{ end }}

type CrudProps = {
    id: string;
    {{ if contains(inputs.option, '多言語対応') }}
    locale?: string;
    {{ end }}
};

const Update = ({ id  {{ if contains(inputs.option, '多言語対応') }}, locale {{ end }} }: CrudProps) => {
    const mutation = {{ useUpdateData }}();
{{ if inputs.confirmPage == '公開側のレンダリング結果を利用' ||  inputs.confirmPage == '管理画面に表示' }}
    const confirmMutation =  {{ useConfirmData }}();
{{ end }}

    const { setError, reset } = useFormContext();

{{ if inputs.confirmPage == '公開側のレンダリング結果を利用' }}
    const [html, setHtml] = useState("");
{{ end }}

{{ if inputs.confirmPage == '公開側のレンダリング結果を利用' ||  inputs.confirmPage == '管理画面に表示' }}
    const [isValid, setValid] = useBoolean();
    const [isConfirm, setConfirm] = useBoolean();
{{ end }}

{{ if inputs.confirmPage == '公開側のレンダリング結果を利用' }}
    const modalAction = useDisclosure();
{{ end }}

{{ if inputs.confirmPage == '公開側のレンダリング結果を利用' ||  inputs.confirmPage == '管理画面に表示' }}
    const navigate = useNavigate();
    const contentsKey = useContentsKey();
{{ end }}

    const query = {{ useData }}({ id {{ if contains(inputs.option, '多言語対応') }}, locale {{ end }}  });

{{ if contains(inputs.option, '多言語対応') }}
   useFormBeforeUnload();
{{ end }}

{{ if contains(inputs.option, 'カテゴリ等マスタデータの利用') }}
    const { data: meta } = {{ useMetadata }}();
{{ end }}


    useEffect(() => {
        if (query.isFetched && query.data) {
            const { status, ...data } = query.data;
            reset(data);
        }
    }, [query.isFetched, query.data, reset]);

    const onSubmit: SubmitHandler<{{ FormValueType }}> = async (values) => {
{{ if inputs.confirmPage == '公開側のレンダリング結果を利用' ||  inputs.confirmPage == '管理画面に表示' }}
        if (isValid && isConfirm) {
              const data = await mutation.mutateAsync({
                data: values,
                id: id,
                {{ if contains(inputs.option, '多言語対応') }}locale: locale,{{ end }}
            });

            navigate(`${adminPrefix}${contentsKey}`);

        } else {
{{ end }}
            try {

{{ if inputs.confirmPage == '公開側のレンダリング結果を利用' }}
                const data = await confirmMutation.mutateAsync({
                    data: values,
                    id: id,
                     {{ if contains(inputs.option, '多言語対応') }}locale: locale,{{ end }}
                });
                if (data.status) {
                    setValid.on();
                    setConfirm.on();
                    if (data.view) {
                        setHtml(data.view);
                        modalAction.onOpen();
                    }
                }
{{ else if inputs.confirmPage == '管理画面に表示' }}
               const data = await confirmMutation.mutateAsync({
                    data: values,
                    id: id,
                });
                if (data.status) {
                    setValid.on();
                    setConfirm.on();
                }
{{ else }}
               const data = await mutation.mutateAsync({
                  data: values,
                  id: id,
              });
{{ end }}

            } catch (e) {
                if (e instanceof AxiosError) {
                    if (e.response?.status === 422) {
                        const errorMessages: ResponseValidationType =
                            e.response.data.error;

                        for (const [key, value] of Object.entries(
                            errorMessages
                        )) {
                            setError(key, { types: value });
                        }
                    }
                }
            }
{{ if inputs.confirmPage == '公開側のレンダリング結果を利用' ||  inputs.confirmPage == '管理画面に表示' }}
        }
{{ end }}
    };

{{ if contains(inputs.option, 'オブジェクトによるフォーム生成の利用') }}
    const elements = GenerateFields({
        model: {{ dataModel }},
        fields: {{ dataFields }},
        {{ if inputs.confirmPage == '公開側のレンダリング結果を利用' ||  inputs.confirmPage == '管理画面に表示' }}isConfirm: isConfirm,{{ end }}
        {{ if contains(inputs.option, 'カテゴリ等マスタデータの利用') }}meta: meta,{{ end }}
         {{ if contains(inputs.option, '多言語対応') }}locale: locale,{{ end }}
    });
{{ end }}

    return (
        <>
         {{ if contains(inputs.option, '多言語対応') }}
         <LocaleFormTab id={id} locale={locale} />
         {{ end }}
        {{ if inputs.confirmPage == '公開側のレンダリング結果を利用' }}
        <FormWithPublicViewConfirm<{{ FormValueType }}>
            onSubmit={onSubmit}
            isLoading={mutation.isLoading}
            isEdit={true}
            isConfirm={isConfirm}
            setConfirm={setConfirm}
            setValid={setValid}
            modalAction={modalAction}
            html={html}
             {{ if contains(inputs.option, 'アクセシビリティチェック') }}
             isAccessibility={true}
             {{ end }}
        >
             {{ if contains(inputs.option, 'オブジェクトによるフォーム生成の利用') }}
                {elements}
             {{ else }}
                  <Form model={ {{- dataModel -}} } isConfirm={isConfirm}  isEdit={true}  {{ if contains(inputs.option, '多言語対応') }} locale={ locale && locale !== defaultLocale ? locale : undefined} {{ end }} />
             {{ end }}
        </FormWithPublicViewConfirm>
        {{ else if inputs.confirmPage == '管理画面に表示' }}
         <FormWithConfirm<{{ FormValueType }}>
            onSubmit={onSubmit}
            isLoading={mutation.isLoading}
            isEdit={true}
            isConfirm={isConfirm}
            setConfirm={setConfirm}
            isConfirmLoading={confirmMutation.isLoading}
             {{ if contains(inputs.option, 'アクセシビリティチェック') }}
             isAccessibility={true}
             {{ end }}
        >
            {{ if contains(inputs.option, 'オブジェクトによるフォーム生成の利用') }}
                {elements}
             {{ else }}
                    <Form model={ {{- dataModel -}} } isConfirm={isConfirm}  isEdit={true}  {{ if contains(inputs.option, '多言語対応') }} locale={ locale && locale !== defaultLocale ? locale : undefined} {{ end }}  />
             {{ end }}
        </FormWithConfirm>
        {{ else }}
        <FormWithoutConfirm<{{ FormValueType }}>
            onSubmit={onSubmit}
            isLoading={mutation.isLoading}
            isEdit={true}
             {{ if contains(inputs.option, 'アクセシビリティチェック') }}
             isAccessibility={true}
             {{ end }}
        >
             {{ if contains(inputs.option, 'オブジェクトによるフォーム生成の利用') }}
                {elements}
             {{ else }}
                    <Form model={ {{- dataModel -}} } isEdit={true}  {{ if contains(inputs.option, '多言語対応') }} locale={ locale && locale !== defaultLocale ? locale : undefined} {{ end }} />
             {{ end }}
        </FormWithoutConfirm>
        {{ end }}
        </>
    );
};

export default Update;

```

# `{{ !contains(inputs.option, 'オブジェクトによるフォーム生成の利用') && (inputs.formType == 'ブロック有' || inputs.formType == 'ブロック無') || '!' }}features/{{ dirname }}/components/Form.tsx`

```tsx
import React from "react";
{{ if contains(inputs.option, 'カテゴリ等マスタデータの利用') }}
import { {{ useMetadata }} } from "../api/{{ metadataFilename }}";
{{ end }}

type FormPropType = {
    model: string;
    isConfirm?: boolean;
    isEdit?: boolean;
    {{ if contains(inputs.option, '多言語対応') }}
    locale?: string;
    {{ end }}
};

const Form = (props: FormPropType) => {
    const { model, isConfirm = false, isEdit = false {{ if contains(inputs.option, '多言語対応') }}, locale{{ end }} } = props;

{{ if contains(inputs.option, 'カテゴリ等マスタデータの利用') }}
    const { data: meta } = {{ useMetadata }}();
{{ end }}

    return (
        <>
        </>
    );
};

export default Form;

```

{{ /* API */ }}

# `features/{{ dirname }}/api/{{ getDatasFilename }}.ts`

```ts
import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { {{ FilterParamType }}, {{ BaseListType }} } from "../types";
import { QueryConfigType } from "@/lib/react-query";

type getOptions = {
    filters?: {{ FilterParamType }};
};

const {{ getDatasFilename }} = async ({ filters }: getOptions): Promise<{{ BaseListType }}> => {
    const response = await axios.get("{{ dirname }}", { params: filters });
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<{{ BaseListType }}>;
    filters?: {{ FilterParamType }};
};

export const {{ useDatas }} = (props: useOptions) => {
    const { filters = {}, options = {} } = props;
    return useQuery(
        [
            "{{ dirname }}",
            Object.keys(filters).length > 0 ? JSON.stringify(filters) : "all",
        ],
        () => {{ getDatasFilename }}({ filters: { ...filters } }),
        options
    );
};

```

# `features/{{ dirname }}/api/{{ getDataFilename }}.ts`

```ts
import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { {{ BaseType }} } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const {{ getDataFilename }} = async ({
    id
    {{ if contains(inputs.option, '多言語対応') }},locale{{ end }} }: {
        id: string;
        {{ if contains(inputs.option, '多言語対応') }}locale?: string; {{ end }}
    }): Promise<{{ BaseType }}> => {
    const response = await axios.get(`{{ dirname }}/${id}` {{ if contains(inputs.option, '多言語対応') }}, {
        params: locale ? { locale: locale } : {},
    }{{ end }});
    return response.data;
};

type useOptions = {
    id: string;
     {{ if contains(inputs.option, '多言語対応') }}locale?: string;{{ end }}
    options?: QueryConfigType<{{ BaseType }}>;
};

export const {{ useData }} = ({ id, options {{ if contains(inputs.option, '多言語対応') }}, locale{{ end }} }: useOptions) => {
     {{ if contains(inputs.option, '多言語対応') }}
        const cacheKey = locale ? `${id}-${locale}` : id;
        return useQuery(
            ["{{ dirname }}", cacheKey],
            () => {{ getDataFilename }}({ id, locale }),
            options
        );
     {{ else }}
        return useQuery(["{{ dirname }}", id], () => {{ getDataFilename }}({ id }), options);
     {{ end }}

};

```

# `features/{{ dirname }}/api/{{ createDataFilename }}.ts`

```ts
import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { {{ FormValueType }}, {{ BaseListType }}, {{ BaseType }} } from "../types";
import { useToast } from "@chakra-ui/react";

export type {{ CreateDataType }} = { data: {{ FormValueType }} };

export const {{ createDataFilename }} = async ({
    data,
}: {{ CreateDataType }}): Promise<{{ BaseType }}> => {
    const response = await axios.post(`{{ dirname }}`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        {{ BaseType }},
        {{ CreateDataType }},
        {
            previousData: {{ BaseListType }} | undefined;
        }
    >;
};

export const {{ useCreateData }} = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation({{ createDataFilename }}, {
        onMutate: async (newData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["{{ dirname }}"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<{{ BaseListType }}>([
                "{{ dirname }}",
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["{{ dirname }}"], {
                    data: [...(previousData.data || []), newData.data],
                    collection: previousData.collection,
                });
            }

            // Return a context object with the snapshotted value
            return { previousData };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["{{ dirname }}"], context.previousData);
            }
            toast({
                position: "top",
                title: `登録に失敗しました`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
        onSuccess(data, variables, context) {
            toast({
                position: "top",
                title: `登録に成功しました`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries(["{{ dirname }}"]);
        },
        ...config,
    });
};

```

# `{{ inputs.confirmPage == '公開側のレンダリング結果を利用' ||  inputs.confirmPage == '管理画面に表示' && (inputs.formType == 'ブロック有' || inputs.formType == 'ブロック無') || '!' }}features/{{ dirname }}/api/{{ confirmDataFilename }}.ts`

```ts
import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType } from "@/lib/react-query";

import { {{ FormValueType }} } from "../types";
import { ConfirmResponseType } from "@/types";
import { useToast } from "@chakra-ui/react";

export type {{ ConfirmDataType }} = {
    data: {{ FormValueType }};
    id?: string
    {{ if contains(inputs.option, '多言語対応') }}locale?: string;{{ end }}
};

export const {{ confirmDataFilename }} = async ({
    data,
    id = undefined,
     {{ if contains(inputs.option, '多言語対応') }}locale,{{ end }}
}: {{ ConfirmDataType }}): Promise<ConfirmResponseType> => {
    const response = id
        ? await axios.post(`{{ dirname }}/confirm/${id}`, data  {{ if contains(inputs.option, '多言語対応') }},{
              params: locale ? { locale: locale } : {},
          }{{ end }})
        : await axios.post(`{{ dirname }}/confirm`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ConfirmResponseType,
        {{ ConfirmDataType }},
        {
            previousData: undefined;
        }
    >;
};

export const {{ useConfirmData }} = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation({{ confirmDataFilename }}, {
        onError: (error, variables, context) => {
            toast({
                position: "top",
                title: `確認に失敗しました`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
        ...config,
    });
};

```

# `features/{{ dirname }}/api/{{ updateDataFilename }}.ts`

```ts
import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { {{ FormValueType }}, {{ BaseType }} } from "../types";
import { useToast } from "@chakra-ui/react";

export type {{ UpdateDataType }} = {
    data: {{ FormValueType }};
    id: string;
     {{ if contains(inputs.option, '多言語対応') }}locale?: string;{{ end }}
};

export const {{ updateDataFilename }} = async ({
    data,
    id,
     {{ if contains(inputs.option, '多言語対応') }}locale,{{ end }}
}: {{ UpdateDataType }}): Promise<{{ BaseType }}> => {
    const response = await axios.post(`{{ dirname }}/${id}`, data, {
        headers: { "X-Http-Method-Override": "PATCH" },
         {{ if contains(inputs.option, '多言語対応') }}params: locale ? { locale: locale } : {},{{ end }}
    });
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        {{ BaseType }},
        {{ UpdateDataType }},
        {
            previousData: {{ BaseType }} | undefined;
        }
    >;
};

export const {{ useUpdateData }} = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation({{ updateDataFilename }}, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["{{ dirname }}"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<{{ BaseType }}>([
                "{{ dirname }}",
                updateData.id,
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["{{ dirname }}", updateData.id], {
                    ...previousData,
                    ...updateData.data,
                    id: updateData.id,
                });
            }

            // Return a context object with the snapshotted value
            return { previousData };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(
                    ["{{ dirname }}", context.previousData.id],
                    context.previousData
                );
            }
            toast({
                position: "top",
                title: `更新に失敗しました`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
        onSuccess(data, variables, context) {
            //
            toast({
                position: "top",
                title: `更新に成功しました`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries(["{{ dirname }}"]);
        },
        ...config,
    });
};

```

# `features/{{ dirname }}/api/schema.ts`

```ts
{{ if contains(inputs.option, 'オブジェクトによるフォーム生成の利用') }}
import { FormFieldType } from "@/types";
import { {{ FormValueType }} } from "../types";
{{ end }}

export const {{ dataModel }} = "{{ modelName }}";

{{ if contains(inputs.option, 'オブジェクトによるフォーム生成の利用') }}
export const {{ dataFields }}: FormFieldType<{{ FormValueType }}>[] = [
    {
        id: "title",
        formType: "input",
        label: "タイトル",
        placeholder: "タイトルを入力してください",
        defaultValue: "",
        formControlOptions: { isRequired: true },
        rule: { required: "タイトルを入力してください" },
    },
    {
        id: "published",
        formType: "date",
        label: "公開日",
        placeholder: "公開日を入力してください",
        defaultValue: new Date().toLocaleDateString().replaceAll("/", "-"),
        formControlOptions: { isRequired: true },
        rule: { required: "タイトルを入力してください" },
    },
    {
        id: "start_date",
        formType: "datePeriod",
        periodGroup: {
            start: {
                id: "start_date",
                formType: "date",
                defaultValue: "",
            },
            end: {
                id: "end_date",
                formType: "date",
                defaultValue: "",
            },
        },
        periodConnector: "~",
        periodLabel: "公開期間",
    },

{{ if inputs.formType == 'ブロック有' }}
    {
        id: "metadata",
        formType: "group",
        defaultValue: "",
        group: [
            {
                id: "metadata.description",
                formType: "textarea",
                label: "デスクリプション",
                placeholder: "デスクリプションを入力してください",
                defaultValue: "",
            },
            {
                id: "metadata.keywords",
                formType: "textarea",
                label: "キーワード",
                placeholder: "キーワードを入力してください",
                defaultValue: "",
            },
            {
                id: "metadata.file_id",
                formType: "image",
                label: "OGP画像(SNS投稿画像)",
                defaultValue: "",
            },
            {
                id: "metadata.model",
                formType: "input",
                inputType: "hidden",
                defaultValue: {{ dataModel }},
            },
        ],
        groupLabel: "メタデータ",
    },
    {
        id: "blocks",
        formType: "block",
        label: "ブロック",
        defaultValue: [],
        blockType: undefined,
        blockModel: {{ dataModel }},
    },
{{ end }}
];
{{ end }}

```

# `{{ contains(inputs.option, 'カテゴリ等マスタデータの利用')  || '!' }}features/{{ dirname }}/api/{{ metadataFilename }}.ts`

```ts
import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { QueryConfigType } from "@/lib/react-query";
import { {{ MetaType }} } from "../types";

const {{ metadataFilename }} = async (): Promise<{{ MetaType }}> => {
    const response = await axios.get(`{{ dirname }}/metadata`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<{{ MetaType }}>;
};

export const {{ useMetadata }} = ({ options }: useOptions = {}) => {
    return useQuery(
        ["{{ dirname }}-meta"],
        () => {{ metadataFilename }}(),
        options
    );
};


```

{{ /* ページ */ }}

# `pages-adsys/{{ subdirname }}adsys/{{ dirname }}/index.tsx`

```tsx
import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";

const Index = lazy(() => import("@/features/{{ dirname }}/components/Index"));

const Top = () => {
    return (
            <ContentLayout title="{{ pageTitle }}">
                <Index />
            </ContentLayout>
    );
};

export default Top;

```

# `{{ inputs.formType == 'ブロック有' || inputs.formType == 'ブロック無' || '!' }}pages-adsys/{{ subdirname }}adsys/{{ dirname }}/crud/index.tsx`

```tsx
import React, { lazy } from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { FormProvider } from "@/providers/form";

const Create = lazy(() => import("@/features/{{ dirname }}/components/Create"));

function CreateIndex() {
    return (
        <FormProvider>
            <ContentLayout title="{{ pageTitle }}">
                <Create />
            </ContentLayout>
        </FormProvider>
    );
}

export default CreateIndex;

```

# `{{ inputs.formType == 'ブロック有' || inputs.formType == 'ブロック無' || '!' }}pages-adsys/{{ subdirname }}adsys/{{ dirname }}/crud/[id].tsx`

```tsx
import React, { lazy } from "react";
import { useParams } from "react-router-dom";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { FormProvider } from "@/providers/form";
import { Skeleton } from "@chakra-ui/react";

const Update = lazy(() => import("@/features/{{ dirname }}/components/Update"));

function UpdateIndex() {
    const { id } = useParams();

    return (
        <FormProvider>
            <ContentLayout title="{{ pageTitle }}">
                <Skeleton isLoaded={id !== undefined}>
                    {id && <Update id={id} />}
                </Skeleton>
            </ContentLayout>
        </FormProvider>
    );
}

export default UpdateIndex;

```

# `{{ contains(inputs.option, '多言語対応')  || '!' }}pages-adsys/{{ subdirname }}adsys/{{ dirname }}/crud/[locale]/[id].tsx`


```tsx
import React, { lazy } from "react";
import { useParams } from "react-router-dom";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { FormProvider } from "@/providers/form";
import { Skeleton } from "@chakra-ui/react";

const Update = lazy(() => import("@/features/{{ dirname }}/components/Update"));

function UpdateIndex() {
    const { id, locale } = useParams();

    return (
        <FormProvider>
            <ContentLayout title="{{ pageTitle }}">
                <Skeleton isLoaded={id !== undefined && locale !== undefined}>
                    {id && locale  && <Update id={id} locale={locale} />}
                </Skeleton>
            </ContentLayout>
        </FormProvider>
    );
}

export default UpdateIndex;

```
