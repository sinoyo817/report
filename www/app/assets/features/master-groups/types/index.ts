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
export type MasterGroupType = {
    title: string;
    email: string;
    mail_body: string;
    note: string;
    published: string;
    start_date: string;
    end_date: string;
    sequence: number;
} & BaseEntityType;

export type MasterGroupListType = {
    data: MasterGroupType[];
    collection: ResoponseCollectionType;
};

/**
 * 調整の必要があれば
 */
export type MasterGroupFormValuesType = Omit<MasterGroupType, IgnoreFormFieldsType>;

/**
 * 追加していく
 *
 * 例
 * {model? : string } & CommonFilterParamType
 *
 */
export type MasterGroupFilterParamType = CommonFilterParamType;

export type MasterGroupMetaType = MetaUtilityType & {};
