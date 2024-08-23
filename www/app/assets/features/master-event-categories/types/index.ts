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
export type MasterEventCategoryType = {
    title: string;

    sequence: number;
} & BaseEntityType;

export type MasterEventCategoryListType = {
    data: MasterEventCategoryType[];
    collection: ResoponseCollectionType;
};

/**
 * 調整の必要があれば
 */
export type MasterEventCategoryFormValuesType = Omit<
    MasterEventCategoryType,
    IgnoreFormFieldsType
>;

/**
 * 追加していく
 *
 * 例
 * {model? : string } & CommonFilterParamType
 *
 */
export type MasterEventCategoryFilterParamType = CommonFilterParamType;
