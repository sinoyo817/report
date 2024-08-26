import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { MasterProductCodeFilterParamType, MasterProductCodeListType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

type getOptions = {
    filters?: MasterProductCodeFilterParamType;
};

const getMasterProductCodes = async ({ filters }: getOptions): Promise<MasterProductCodeListType> => {
    const response = await axios.get("master-product-codes", { params: filters });
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<MasterProductCodeListType>;
    filters?: MasterProductCodeFilterParamType;
};

export const useMasterProductCodes = (props: useOptions) => {
    const { filters = {}, options = {} } = props;
    return useQuery(
        [
            "master-product-codes",
            Object.keys(filters).length > 0 ? JSON.stringify(filters) : "all",
        ],
        () => getMasterProductCodes({ filters: { ...filters } }),
        options
    );
};
