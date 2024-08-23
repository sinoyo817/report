import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { TopicFilterParamType, TopicListType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

type getOptions = {
    filters?: TopicFilterParamType;
};

const getTopics = async ({ filters }: getOptions): Promise<TopicListType> => {
    const response = await axios.get("topics", { params: filters });
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<TopicListType>;
    filters?: TopicFilterParamType;
};

export const useTopics = (props: useOptions) => {
    const { filters = {}, options = {} } = props;
    return useQuery(
        [
            "topics",
            Object.keys(filters).length > 0 ? JSON.stringify(filters) : "all",
        ],
        () => getTopics({ filters: { ...filters } }),
        options
    );
};
