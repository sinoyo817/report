import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { QueryConfigType } from "@/lib/react-query";
import { ApprovalsMetaType } from "../types";

const getApprovalsMeta = async (): Promise<ApprovalsMetaType> => {
    const response = await axios.get(`approvals/metadata`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<ApprovalsMetaType>;
};

export const useApprovalMeta = ({ options }: useOptions = {}) => {
    return useQuery(["mng-approvals-meta"], () => getApprovalsMeta(), options);
};
