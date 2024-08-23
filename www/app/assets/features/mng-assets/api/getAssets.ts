import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { AssetFilterParamType, AssetListType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

type getOptions = {
    filters?: AssetFilterParamType;
};

const getAssets = async ({ filters }: getOptions): Promise<AssetListType> => {
    const response = await axios.get("assets", { params: filters });
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<AssetListType>;
    filters?: AssetFilterParamType;
};

export const useAssets = (props: useOptions) => {
    const { filters = {}, options = {} } = props;
    return useQuery(
        [
            "mng-assets",
            Object.keys(filters).length > 0 ? JSON.stringify(filters) : "all",
        ],
        () => getAssets({ filters: { ...filters } }),
        options
    );
};
