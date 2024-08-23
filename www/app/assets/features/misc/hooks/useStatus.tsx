import React from "react";
import { useAuth } from "@/lib/auth";
import { AllApprovalStatusListsType } from "@/types";
import { useContentsKey } from "./useContentsKey";

export type useStatusPropType = {
    status: AllApprovalStatusListsType;
    statusKey?: string;
};

export const useStatus = (props: useStatusPropType) => {
    const { status, statusKey } = props;
    const contentsKey = useContentsKey();
    const {
        user: { data },
    } = useAuth();

    const approvalStatusOptions =
        (statusKey && (data?.meta.statusOptions[statusKey] || undefined)) ||
        data?.meta.statusOptions[contentsKey] ||
        data?.meta.statusOptions.default;

    const statusData = approvalStatusOptions?.find(
        (item) => item.status === status
    );

    return statusData;
};
