import {
    BaseBlockEntityType,
    BaseEntityType,
    CommonFilterParamType,
    IgnoreFormFieldsType,
    ResoponseCollectionType,
} from "@/types";

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
} & BaseEntityType;

export type FileListType = {
    data: FileType[];
    collection: ResoponseCollectionType;
};

export type FileFormValuesType = FormData;

export type FileFilterParamType = CommonFilterParamType & {
    model?: string | string[];
    type?: "image" | "file" | string | null;
};
