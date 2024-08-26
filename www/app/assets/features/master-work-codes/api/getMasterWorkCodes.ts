import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { MasterWorkCodeFilterParamType, MasterWorkCodeListType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

type getOptions = {
    filters?: MasterWorkCodeFilterParamType;
};

const getMasterWorkCodes = async ({ filters }: getOptions): Promise<MasterWorkCodeListType> => {
    const response = await axios.get("master-work-codes", { params: filters });
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<MasterWorkCodeListType>;
    filters?: MasterWorkCodeFilterParamType;
};

export const useMasterWorkCodes = (props: useOptions) => {
    const { filters = {}, options = {} } = props;
    return useQuery(
        [
            "master-work-codes",
            Object.keys(filters).length > 0 ? JSON.stringify(filters) : "all",
        ],
        () => getMasterWorkCodes({ filters: { ...filters } }),
        options
    );
};
