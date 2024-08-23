import { AdminType } from "@/features/admins";
import { FileType } from "@/features/files";
import { SettingsFreepageType } from "@/features/mng-settings";
import {
    BaseBlockEntityType,
    BaseEntityType,
    CommonFilterParamType,
    IgnoreFormFieldsType,
    ResoponseCollectionType,
    MetadataType,
    MetaUtilityType,
    BaseSelectOptions,
    ApprovalRemandType,
} from "@/types";

export type FreepageTypeType = "directory" | "document";

export type FreepageShowType = "tree" | "table";

/**
 * 追加していく
 */
export type FreepageDirectoryType = {
    parent_id: string;
    type: "directory" | "document";
    lft: number;
    rght: number;
    title: string;
    path: string;
    path_url: string;
    freepage_document_id?: string;
    freepage_document?: FreepageDocumentType;
    body?: string;
    published?: string;
    start_date?: string;
    end_date?: string;
    create_admin?: AdminType;
    modified_admin?: AdminType;
    approval_remands: ApprovalRemandType[];
} & BaseEntityType;

export type FreepageDocumentType = {
    title: string;
    sub_title: string;
    path: string;
    file?: FileType;
    file_alt?: string;
    summary?: string;
    summary_files?: string;
    published: string;
    start_date: string;
    end_date: string;
    create_admin?: AdminType;
    modified_admin?: AdminType;
    blocks: BaseBlockEntityType[];
    metadata?: MetadataType | null;
    freepage_directories?: FreepageDirectoryType[];
    // approval_remands: ApprovalRemandType[];
} & BaseEntityType;

export type FreepageDirectoryListType = {
    data: FreepageDirectoryType[];
    collection: ResoponseCollectionType;
};

/**
 * 調整の必要があれば
 */

export type FreepageDirectoryFormValuesType = Pick<
    FreepageDirectoryType,
    "type" | "parent_id" | "title" | "path"
> & { id?: string };
export type FreepageDirectorySequenceFormValuesType = {
    parent_id: string;
    number: number;
};
export type FreepageDocumentFormValuesType = Omit<
    Omit<FreepageDocumentType, "freepage_directories">,
    IgnoreFormFieldsType
> & {
    freepage_directories: {
        parent_id: string;
        id: string;
    }[];
};

/**
 * 追加していく
 *
 * 例
 * {model? : string } & CommonFilterParamType
 *
 */
export type FreepageFilterParamType = CommonFilterParamType;

export type FreepageDirectoriesCheckType = BaseSelectOptions & {
    parent_id: string;
};

/**
 * 追加していく
 *
 * 例
 * {master_category : BaseSelectOptions[] } & MetaUtilityType
 *
 */
export type FreepageDirectoryMetaType = MetaUtilityType & {
    master_freepage_types: Record<FreepageTypeType, string>;
    master_freepage_directories: Record<string, string>;
    settings: SettingsFreepageType;
};
export type FreepageDocumentMetaType = MetaUtilityType & {
    // master_freepage_types: Record<FreepageTypeType, string>;
    master_freepage_directories: Record<string, string>;
    settings: SettingsFreepageType;
};
