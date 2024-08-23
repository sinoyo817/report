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
export type MasterContactCategoryType = {
    title: string;
    published: string;
    start_date: string;
    end_date: string;
    
    sequence: number;
     
} & BaseEntityType;

export type MasterContactCategoryListType = {
    data: MasterContactCategoryType[];
    collection: ResoponseCollectionType;
};

/**
 * 調整の必要があれば
 */
export type MasterContactCategoryFormValuesType = Omit<MasterContactCategoryType, IgnoreFormFieldsType>;

/**
 * 追加していく
 *
 * 例
 * {model? : string } & CommonFilterParamType
 *
 */
export type MasterContactCategoryFilterParamType = CommonFilterParamType;

