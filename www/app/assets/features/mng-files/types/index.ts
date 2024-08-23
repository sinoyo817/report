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
export type FileType = {
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
    model: string;
} & BaseEntityType;
export type FileListType = {
    data: FileType[];
    collection: ResoponseCollectionType;
};

/**
 * 調整の必要があれば
 */
export type FileFormValuesType = Omit<FileType, IgnoreFormFieldsType>;

/**
 * 追加していく
 *
 * 例
 * {model? : string } & CommonFilterParamType
 *
 */
export type FileFilterParamType = CommonFilterParamType & {
    model?: string;
    type?: "image" | "file" | string | null;
};

export type FilesMetaType = {
    all_contents: Record<string, string>;
};
