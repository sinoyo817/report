import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { QueryConfigType } from "@/lib/react-query";
import { FreepageDirectoryMetaType } from "../types";

const getFreepageDirectoryMeta =
    async (): Promise<FreepageDirectoryMetaType> => {
        const response = await axios.get(`freepage-directories/metadata`);
        return response.data;
    };

type useOptions = {
    options?: QueryConfigType<FreepageDirectoryMetaType>;
};

export const useFreepageDirectoryMeta = ({ options }: useOptions = {}) => {
    return useQuery(
        ["freepage-directories-meta"],
        () => getFreepageDirectoryMeta(),
        options
    );
};
