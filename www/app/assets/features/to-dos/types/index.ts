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
export type ToDoType = {
    title: string;
    summary: string;
    note: string;
    published: string;
    start_date: string;
    end_date: string;
    sequence: number;

    create_admin?: AdminType;
    create_user?: AdminType;
    modified_admin?: AdminType;
    modified_user?: AdminType;
} & BaseEntityType;

export type ToDoListType = {
    data: ToDoType[];
    collection: ResoponseCollectionType;
};

/**
 * 調整の必要があれば
 */
export type ToDoFormValuesType = Omit<ToDoType, IgnoreFormFieldsType>;

/**
 * 追加していく
 *
 * 例
 * {model? : string } & CommonFilterParamType
 *
 */
export type ToDoFilterParamType = CommonFilterParamType;

/**
 * 追加していく
 *
 * 例
 * {master_category : BaseSelectOptions[] } & MetaUtilityType
 *
 */
export type ToDoMetaType = MetaUtilityType;

