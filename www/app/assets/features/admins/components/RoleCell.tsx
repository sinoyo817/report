import { AuthRoleType } from "@/features/auth";
import React from "react";
import { useAdminMeta } from "../api/getAdminMeta";

export type RoleCellPropType = {
    role?: AuthRoleType;
};

const RoleCell = (props: RoleCellPropType) => {
    const { role } = props;
    const { data: meta } = useAdminMeta();

    if (meta?.role && role) {
        const roleData = meta.role.find((item) => item.role === role);
        if (roleData) {
            return <>{roleData.title}</>;
        }
    }
    return <></>;
};
export default RoleCell;
