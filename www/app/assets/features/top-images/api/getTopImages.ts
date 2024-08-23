import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { TopImageFilterParamType, TopImageListType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

type getOptions = {
    filters?: TopImageFilterParamType;
};

const getTopImages = async ({ filters }: getOptions): Promise<TopImageListType> => {
    const response = await axios.get("top-images", { params: filters });
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<TopImageListType>;
    filters?: TopImageFilterParamType;
};

export const useTopImages = (props: useOptions) => {
    const { filters = {}, options = {} } = props;
    return useQuery(
        [
            "top-images",
            Object.keys(filters).length > 0 ? JSON.stringify(filters) : "all",
        ],
        () => getTopImages({ filters: { ...filters } }),
        options
    );
};
