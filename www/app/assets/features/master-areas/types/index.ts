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
export type MasterAreaType = {
    title: string;
    class: string;
    sequence: number;
} & BaseEntityType;

export type MasterAreaListType = {
    data: MasterAreaType[];
    collection: ResoponseCollectionType;
};

/**
 * 調整の必要があれば
 */
export type MasterAreaFormValuesType = Omit<
    MasterAreaType,
    IgnoreFormFieldsType
>;

/**
 * 追加していく
 *
 * 例
 * {model? : string } & CommonFilterParamType
 *
 */
export type MasterAreaFilterParamType = CommonFilterParamType;
