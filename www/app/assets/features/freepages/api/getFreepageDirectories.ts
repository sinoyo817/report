import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { FreepageFilterParamType, FreepageDirectoryListType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

type getOptions = {
    filters?: FreepageFilterParamType;
};

const getFreepageDirectories = async ({
    filters,
}: getOptions): Promise<FreepageDirectoryListType> => {
    const response = await axios.get("freepage-directories", {
        params: filters,
    });
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<FreepageDirectoryListType>;
    filters?: FreepageFilterParamType;
};

export const useFreepageDirectories = (props: useOptions) => {
    const { filters = {}, options = {} } = props;
    return useQuery(
        [
            "freepage-directories",
            Object.keys(filters).length > 0 ? JSON.stringify(filters) : "all",
        ],
        () => getFreepageDirectories({ filters: { ...filters } }),
        options
    );
};
