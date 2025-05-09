import { AuthRoleType } from "@/features/auth";
import { MasterGroupType } from "@/features/master-groups";
import {
    BaseEntityType,
    BaseSelectOptions,
    CommonFilterParamType,
    IgnoreFormFieldsType,
    ResoponseCollectionType,
    UnkownUtilityType,
} from "@/types";

export type AdminType = {
    title: string;
    code?: string;
    group_id?: string;
    master_group?: MasterGroupType;
    username: string;
    email: string;
    note?: string;
    signature?: string;
    role: AuthRoleType;
} & BaseEntityType;

export type AdminsResponse = AdminType[];

export type AdminListType = {
    data: AdminType[];
    collection: ResoponseCollectionType;
};

export type AdminFormValuesType = Omit<AdminType, IgnoreFormFieldsType> & {
    password_new: string;
};

export type AdminFilterParamType = CommonFilterParamType;

export type AdminMetaType = {
    role: { role: AuthRoleType; title: string }[];
    master_cities: BaseSelectOptions[];
    groups: BaseSelectOptions[];
} & UnkownUtilityType;
