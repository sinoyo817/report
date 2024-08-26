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
export type MasterProductCodeType = {
    title: string;
    code: string;
    can: string;
    published: string;
    start_date: string;
    end_date: string;
    sequence: number;
    create_admin?: AdminType;
    create_user?: AdminType;
    modified_admin?: AdminType;
    modified_user?: AdminType;
} & BaseEntityType;

export type MasterProductCodeListType = {
    data: MasterProductCodeType[];
    collection: ResoponseCollectionType;
};

/**
 * 調整の必要があれば
 */
export type MasterProductCodeFormValuesType = Omit<MasterProductCodeType, IgnoreFormFieldsType>;

/**
 * 追加していく
 *
 * 例
 * {model? : string } & CommonFilterParamType
 *
 */
export type MasterProductCodeFilterParamType = CommonFilterParamType;

/**
 * 追加していく
 *
 * 例
 * {master_category : BaseSelectOptions[] } & MetaUtilityType
 *
 */
export type MasterProductCodeMetaType = MetaUtilityType;

