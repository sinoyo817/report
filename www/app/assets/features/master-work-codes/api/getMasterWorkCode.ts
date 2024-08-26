import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { MasterWorkCodeType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getMasterWorkCode = async ({
    id
     }: {
        id: string;
    }): Promise<MasterWorkCodeType> => {
    const response = await axios.get(`master-work-codes/${id}` );
    return response.data;
};

type useOptions = {
    id: string;
    options?: QueryConfigType<MasterWorkCodeType>;
};

export const useMasterWorkCode = ({ id, options  }: useOptions) => {
    return useQuery(["master-work-codes", id], () => getMasterWorkCode({ id }), options);
};
