import {
    BaseBlockEntityType,
    BaseEntityType,
    CommonFilterParamType,
    IgnoreFormFieldsType,
    ResoponseCollectionType,
    MetadataType,
} from "@/types";

/**
 * 追加していく
 */
export type AssetType = {
    title: string | null;
    filename: string;
    path: string;
    size: number;
    mime: string;
    hash: string;
    base64: string | null;
    filePath: string;
    fileFullPath: string;
    fileCmsPath: string;
    fileCmsFullPath: string;
} & BaseEntityType;

export type AssetListType = {
    data: AssetType[];
    collection: ResoponseCollectionType;
};

/**
 * 調整の必要があれば
 */
export type AssetFormValuesType = FormData;

/**
 * 追加していく
 *
 * 例
 * {model? : string } & CommonFilterParamType
 *
 */
export type AssetFilterParamType = CommonFilterParamType & {
    type?: "image" | "file" | string | null;
};
