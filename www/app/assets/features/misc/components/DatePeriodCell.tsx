import React from "react";
import { AllApprovalStatusListsType } from "@/types";
import { useStatus } from "../hooks/useStatus";

export type DatePeriodCellPropType = {
    startDate?: string | null;
    endDate?: string | null;
    emptyText?: string;
};

export const DatePeriodCell = (props: DatePeriodCellPropType) => {
    const { startDate, endDate, emptyText = "常時公開" } = props;

    if (startDate || endDate) {
        if (startDate && endDate) {
            return (
                <>
                    {startDate}~{endDate}
                </>
            );
        } else if (startDate) {
            return <>{startDate}</>;
        } else if (endDate) {
            return <>{endDate}</>;
        }
    }

    return <>{emptyText}</>;
};
