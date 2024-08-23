import { AdminType } from "@/features/admins";
import { FileType } from "@/features/files";
import {
    ApprovalRemandType,
    BaseBlockEntityType,
    BaseEntityType,
    CommonFilterParamType,
    IgnoreFormFieldsType,
    ResoponseCollectionType,
    MetadataType,
    
    MetaUtilityType,
} from "@/types";

/**
 * 追加していく
 */
export type TopImageType = {
    title: string;
    published: string;
    start_date: string;
    end_date: string | null;
    image_id: string;
    image_alt: string;
    url: string;
    url_is_blank: string;
    sp_image_id: string;
    sp_image_alt: string;
    sp_url: string;
    sp_url_is_blank: string;
    
    sequence: number;
    create_admin?: AdminType;
    create_user?: AdminType;
    modified_admin?: AdminType;
    modified_user?: AdminType;
    _translations?: Record<string, Omit<TopImageType, "_translations">>;
} & BaseEntityType;

export type TopImageListType = {
    data: TopImageType[];
    collection: ResoponseCollectionType;
};

/**
 * 調整の必要があれば
 */
export type TopImageFormValuesType = Omit<TopImageType, IgnoreFormFieldsType>;

/**
 * 追加していく
 *
 * 例
 * {model? : string } & CommonFilterParamType
 *
 */
export type TopImageFilterParamType = CommonFilterParamType;

/**
 * 追加していく
 *
 * 例
 * {master_category : BaseSelectOptions[] } & MetaUtilityType
 *
 */
export type TopImageMetaType = MetaUtilityType;

