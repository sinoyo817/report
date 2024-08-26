import { AdminType } from "@/features/admins";
import {
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
export type MasterWorkCodeType = {
    title: string;
    code: string;
    published: string;
    start_date: string;
    end_date: string;
    sequence: number;
    create_admin?: AdminType;
    create_user?: AdminType;
    modified_admin?: AdminType;
    modified_user?: AdminType;
} & BaseEntityType;

export type MasterWorkCodeListType = {
    data: MasterWorkCodeType[];
    collection: ResoponseCollectionType;
};

/**
 * 調整の必要があれば
 */
export type MasterWorkCodeFormValuesType = Omit<MasterWorkCodeType, IgnoreFormFieldsType>;

/**
 * 追加していく
 *
 * 例
 * {model? : string } & CommonFilterParamType
 *
 */
export type MasterWorkCodeFilterParamType = CommonFilterParamType;

/**
 * 追加していく
 *
 * 例
 * {master_category : BaseSelectOptions[] } & MetaUtilityType
 *
 */
export type MasterWorkCodeMetaType = MetaUtilityType;

