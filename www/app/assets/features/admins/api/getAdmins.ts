import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { AdminFilterParamType, AdminListType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

type getOptions = {
    filters?: AdminFilterParamType;
};

const getAdmins = async ({ filters }: getOptions): Promise<AdminListType> => {
    const response = await axios.get("admins", { params: filters });
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<AdminListType>;
    filters?: AdminFilterParamType;
};

export const useAdmins = (props: useOptions) => {
    const { filters = {}, options = {} } = props;
    return useQuery(
        [
            "admins",
            Object.keys(filters).length > 0 ? JSON.stringify(filters) : "all",
        ],
        () => getAdmins({ filters: { ...filters } }),
        options
    );
};
