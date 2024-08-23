import {
    BaseEntityType,
    CommonFilterParamType,
    IgnoreFormFieldsType,
    ResoponseCollectionType,
    MetaUtilityType,
    BaseSelectOptions,
} from "@/types";

/**
 * 追加していく
 */
export type DeadLinkType = {
    title: string;
    sub_title?: string;
    url: string;
    target_url: string;
    target_id: string;
    target_contents: string;
    target_title: string;
    target_admin_url: string;
} & BaseEntityType;

export type DeadLinkListType = {
    data: DeadLinkType[];
    collection: ResoponseCollectionType;
};

/**
 * 調整の必要があれば
 */
export type DeadLinkFormValuesType = Omit<DeadLinkType, IgnoreFormFieldsType>;

/**
 * 追加していく
 *
 * 例
 * {model? : string } & CommonFilterParamType
 *
 */
export type DeadLinkFilterParamType = CommonFilterParamType;

/**
 * 追加していく
 *
 * 例
 * {master_category : BaseSelectOptions[] } & MetaUtilityType
 *
 */
export type DeadLinkMetaType = {
    exec?: { start: string; end?: string };
} & MetaUtilityType;
