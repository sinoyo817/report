import { AuthRoleType } from "@/features/auth";
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
    username: string;
    email: string;
    note?: string;
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
} & UnkownUtilityType;
