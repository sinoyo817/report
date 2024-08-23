import React from "react";
import { AllApprovalStatusListsType } from "@/types";
import { useStatus } from "../hooks/useStatus";
import { Badge, BadgeProps } from "@chakra-ui/react";

export type StatusCellPropType = {
    status: AllApprovalStatusListsType;
    statusKey?: string;
} & BadgeProps;

export const StatusCell = (props: StatusCellPropType) => {
    const { status, statusKey, ...badgeOptions } = props;
    const statusData = useStatus({ status: status, statusKey: statusKey });

    return statusData ? (
        <Badge
            colorScheme={statusData?.colorScheme}
            mb="1"
            w="55%"
            rounded="2xl"
            textAlign="center"
            {...badgeOptions}
        >
            {statusData?.title}
        </Badge>
    ) : (
        <>---</>
    );
};
