import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { AssetType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getAsset = async ({ id }: { id: string }): Promise<AssetType> => {
    const response = await axios.get(`assets/${id}`);
    return response.data;
};

type useOptions = {
    id: string;
    options?: QueryConfigType<AssetType>;
};

export const useAsset = ({ id, options }: useOptions) => {
    return useQuery(["mng-assets", id], () => getAsset({ id }), options);
};
