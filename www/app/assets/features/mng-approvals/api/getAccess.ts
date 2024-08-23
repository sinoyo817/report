import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { ApprovalsAccessType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getApprovalAccess = async (): Promise<ApprovalsAccessType> => {
    const response = await axios.get(`approvals/access-view`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<ApprovalsAccessType>;
};

export const useApprovalAccess = ({ options }: useOptions) => {
    return useQuery(
        ["mng-approval-access"],
        () => getApprovalAccess(),
        options
    );
};
