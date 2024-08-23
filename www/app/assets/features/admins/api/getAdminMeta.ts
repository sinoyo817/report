import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { QueryConfigType } from "@/lib/react-query";
import { AdminMetaType } from "../types";

const getAdminMeta = async (): Promise<AdminMetaType> => {
    const response = await axios.get(`admins/metadata`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<AdminMetaType>;
};

export const useAdminMeta = ({ options }: useOptions = {}) => {
    return useQuery(["admins-meta"], () => getAdminMeta(), options);
};
