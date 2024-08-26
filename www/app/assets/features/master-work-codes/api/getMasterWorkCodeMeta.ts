import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { QueryConfigType } from "@/lib/react-query";
import { MasterWorkCodeMetaType } from "../types";

const getMasterWorkCodeMeta = async (): Promise<MasterWorkCodeMetaType> => {
    const response = await axios.get(`master-work-codes/metadata`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<MasterWorkCodeMetaType>;
};

export const useMasterWorkCodeMeta = ({ options }: useOptions = {}) => {
    return useQuery(
        ["master-work-codes-meta"],
        () => getMasterWorkCodeMeta(),
        options
    );
};

