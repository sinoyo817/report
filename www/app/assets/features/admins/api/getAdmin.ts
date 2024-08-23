import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { AdminType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getAdmin = async ({ id }: { id: string }): Promise<AdminType> => {
    const response = await axios.get(`admins/${id}`);
    return response.data;
};

type useOptions = {
    id: string;
    options?: QueryConfigType<AdminType>;
};

export const useAdmin = ({ id, options }: useOptions) => {
    return useQuery(["admins", id], () => getAdmin({ id }), options);
};
