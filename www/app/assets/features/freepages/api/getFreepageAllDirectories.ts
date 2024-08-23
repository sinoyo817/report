import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { FreepageFilterParamType, FreepageDirectoryListType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

type getOptions = {
    filters?: FreepageFilterParamType;
};

const getFreepageAllDirectories =
    async (): Promise<FreepageDirectoryListType> => {
        const response = await axios.get("freepage-directories/all");
        return response.data;
    };

type useOptions = {
    options?: QueryConfigType<FreepageDirectoryListType>;
};

export const useFreepageAllDirectories = (props: useOptions) => {
    const { options = {} } = props;
    return useQuery(
        ["freepage-all-directories"],
        () => getFreepageAllDirectories(),
        options
    );
};
