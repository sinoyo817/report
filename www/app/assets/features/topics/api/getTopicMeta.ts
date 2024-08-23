import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { QueryConfigType } from "@/lib/react-query";
import { TopicMetaType } from "../types";

const getTopicMeta = async (): Promise<TopicMetaType> => {
    const response = await axios.get(`topics/metadata`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<TopicMetaType>;
};

export const useTopicMeta = ({ options }: useOptions = {}) => {
    return useQuery(["topics-meta"], () => getTopicMeta(), options);
};
