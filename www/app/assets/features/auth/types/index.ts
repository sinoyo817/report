import { ApprovalStatusOptionType } from "@/config";
import { AdminType } from "@/features/admins";

export type AuthType = {
    id: string;
    title: string;
    meta: AuthMetaType;
};

export type AuthStateType = AuthType | null;

export type SideNavigationItemType = {
    title: string;
    links: {
        name: string;
        to: string;
        key: string;
        titleKey: string;
        sequence: number;
    }[];
};

export type AuthRoleType = "Admin" | "Editor" | string;

type AuthStatusDefaultOptions = {
    default: ApprovalStatusOptionType[];
};

export type AuthMetaType = {
    routes: SideNavigationItemType[];
    role: AuthRoleType;
    redirectUri?: string;
    statusOptions: AuthStatusDefaultOptions &
        Record<string, ApprovalStatusOptionType[]>;
};

export type LoginRequestType = {
    username: string;
    password: string;
};

export type AuthFormValueType = Pick<
    AdminType,
    "title" | "username" | "email"
> & {
    password_new?: string;
};

export type AuthPasswordFormValueType = {
    current_password: string;
    password_new: string;
    password_new_confirm: string;
};
