import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { QueryConfigType } from "@/lib/react-query";
import { BunnerMetaType } from "../types";

const getBunnerMeta = async (): Promise<BunnerMetaType> => {
    const response = await axios.get(`bunners/metadata`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<BunnerMetaType>;
};

export const useBunnerMeta = ({ options }: useOptions = {}) => {
    return useQuery(
        ["bunners-meta"],
        () => getBunnerMeta(),
        options
    );
};

