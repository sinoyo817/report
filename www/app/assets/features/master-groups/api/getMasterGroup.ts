import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { MasterGroupType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getMasterGroup = async ({
    id
     }: {
        id: string;
    }): Promise<MasterGroupType> => {
    const response = await axios.get(`master-groups/${id}` );
    return response.data;
};

type useOptions = {
    id: string;
    options?: QueryConfigType<MasterGroupType>;
};

export const useMasterGroup = ({ id, options  }: useOptions) => {
    return useQuery(["master-groups", id], () => getMasterGroup({ id }), options);
};
