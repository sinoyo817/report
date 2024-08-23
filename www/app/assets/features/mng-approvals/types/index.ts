import { AuthRoleType } from "@/features/auth";
import { BasicDisplayShowType } from "@/features/mng-settings";

export type ApprovalsAccessType = {
    [x in AuthRoleType]: {
        [x in string]:
            | {
                  enabled: BasicDisplayShowType;
                  options: string;
              }
            | string;
    };
};

export type ApprovalAccessFormValuesType = ApprovalsAccessType;

export type ApprovalsMetaType = {
    all_roles: Record<string, string>;
    all_contents: Record<string, string>;
    all_status_options: Record<string, string>;
    basic_display_show: Record<BasicDisplayShowType, string>;
};
