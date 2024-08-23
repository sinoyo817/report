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
export type MasterTopicCategoryType = {
    title: string;
    class: string;
    sequence: number;
    _translations?: Record<
        string,
        Omit<MasterTopicCategoryType, "_translations">
    >;
} & BaseEntityType;

export type MasterTopicCategoryListType = {
    data: MasterTopicCategoryType[];
    collection: ResoponseCollectionType;
};

/**
 * 調整の必要があれば
 */
export type MasterTopicCategoryFormValuesType = Omit<
    MasterTopicCategoryType,
    IgnoreFormFieldsType
>;

/**
 * 追加していく
 *
 * 例
 * {model? : string } & CommonFilterParamType
 *
 */
export type MasterTopicCategoryFilterParamType = CommonFilterParamType;
