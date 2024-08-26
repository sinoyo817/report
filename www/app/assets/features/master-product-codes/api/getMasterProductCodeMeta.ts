import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { QueryConfigType } from "@/lib/react-query";
import { MasterProductCodeMetaType } from "../types";

const getMasterProductCodeMeta = async (): Promise<MasterProductCodeMetaType> => {
    const response = await axios.get(`master-product-codes/metadata`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<MasterProductCodeMetaType>;
};

export const useMasterProductCodeMeta = ({ options }: useOptions = {}) => {
    return useQuery(
        ["master-product-codes-meta"],
        () => getMasterProductCodeMeta(),
        options
    );
};

