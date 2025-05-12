import { AdminType } from "@/features/admins";
import { MasterProductCodeType } from "@/features/master-product-codes";
import { MasterWorkCodeType } from "@/features/master-work-codes";
import {
    BaseBlockEntityType,
    BaseEntityType,
    CommonFilterParamType,
    IgnoreFormFieldsType,
    ResoponseCollectionType,
    MetadataType,
    BaseSelectOptions,
    MetaUtilityType,
} from "@/types";

/**
 * 追加していく
 */
export type DayWorkType = {
    title: string;
    work_date: string;
    published: string;
    start_time: string;
    end_time: string;
    send_text: string;
    report: string;
    master_product_code:MasterProductCodeType
    master_work_code:MasterWorkCodeType


    blocks: BaseBlockEntityType[];
    metadata?: MetadataType | null;
    create_admin?: AdminType;
    create_user?: AdminType;
    modified_admin?: AdminType;
    modified_user?: AdminType;

    sequence: number;
    total: string;

} & BaseEntityType;

export type DayWorkListType = {
    data: DayWorkType[];
    collection: ResoponseCollectionType;
};

/**
 * 調整の必要があれば
 */
export type DayWorkFormValuesType = Omit<DayWorkType, IgnoreFormFieldsType>;

/**
 * 追加していく
 *
 * 例
 * {model? : string } & CommonFilterParamType
 *
 */
export type DayWorkFilterParamType = CommonFilterParamType;

/**
 * 追加していく
 *
 * 例
 * {master_category : BaseSelectOptions[] } & MetaUtilityType
 *
 */
export type DayWorkMetaType = MetaUtilityType & {
    master_product_codes?: BaseSelectOptions[];
    private_master_product_codes?: BaseSelectOptions[];
    master_work_codes?: BaseSelectOptions[];
    admins?: BaseSelectOptions[];
};

