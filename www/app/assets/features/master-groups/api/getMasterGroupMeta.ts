import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { QueryConfigType } from "@/lib/react-query";
import { MasterGroupMetaType } from "../types";

const getMasterGroupMeta = async (): Promise<MasterGroupMetaType> => {
    const response = await axios.get(`day-works/metadata`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<MasterGroupMetaType>;
};

export const useMasterGroupMeta = ({ options }: useOptions = {}) => {
    return useQuery(
        ["day-works-meta"],
        () => getMasterGroupMeta(),
        options
    );
};

