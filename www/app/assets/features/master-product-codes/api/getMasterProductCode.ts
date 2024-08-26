import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { MasterProductCodeType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getMasterProductCode = async ({
    id
     }: {
        id: string;
    }): Promise<MasterProductCodeType> => {
    const response = await axios.get(`master-product-codes/${id}` );
    return response.data;
};

type useOptions = {
    id: string;
    options?: QueryConfigType<MasterProductCodeType>;
};

export const useMasterProductCode = ({ id, options  }: useOptions) => {
        return useQuery(["master-product-codes", id], () => getMasterProductCode({ id }), options);

};
