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
export type BunnerType = {
    title: string;
    published: string;
    start_date: string;
    end_date: string;
    file_id: string;
    file_alt: string;
    url: string;
    url_is_blank: string;
    
    sequence: number;
     
      
    _translations?: Record<string, Omit<BunnerType, "_translations">>;
      
} & BaseEntityType;

export type BunnerListType = {
    data: BunnerType[];
    collection: ResoponseCollectionType;
};

/**
 * 調整の必要があれば
 */
export type BunnerFormValuesType = Omit<BunnerType, IgnoreFormFieldsType>;

/**
 * 追加していく
 *
 * 例
 * {model? : string } & CommonFilterParamType
 *
 */
export type BunnerFilterParamType = CommonFilterParamType;

/**
 * 追加していく
 *
 * 例
 * {master_category : BaseSelectOptions[] } & MetaUtilityType
 *
 */
export type BunnerMetaType = MetaUtilityType;

