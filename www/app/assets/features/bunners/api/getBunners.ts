import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { BunnerFilterParamType, BunnerListType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

type getOptions = {
    filters?: BunnerFilterParamType;
};

const getBunners = async ({ filters }: getOptions): Promise<BunnerListType> => {
    const response = await axios.get("bunners", { params: filters });
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<BunnerListType>;
    filters?: BunnerFilterParamType;
};

export const useBunners = (props: useOptions) => {
    const { filters = {}, options = {} } = props;
    return useQuery(
        [
            "bunners",
            Object.keys(filters).length > 0 ? JSON.stringify(filters) : "all",
        ],
        () => getBunners({ filters: { ...filters } }),
        options
    );
};
