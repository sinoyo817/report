import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { MasterGroupFilterParamType, MasterGroupListType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

type getOptions = {
    filters?: MasterGroupFilterParamType;
};

const getMasterGroups = async ({ filters }: getOptions): Promise<MasterGroupListType> => {
    const response = await axios.get("master-groups", { params: filters });
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<MasterGroupListType>;
    filters?: MasterGroupFilterParamType;
};

export const useMasterGroups = (props: useOptions) => {
    const { filters = {}, options = {} } = props;
    return useQuery(
        [
            "master-groups",
            Object.keys(filters).length > 0 ? JSON.stringify(filters) : "all",
        ],
        () => getMasterGroups({ filters: { ...filters } }),
        options
    );
};
