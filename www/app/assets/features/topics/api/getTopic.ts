import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { TopicType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getTopic = async ({
    id,
    locale,
}: {
    id: string;
    locale?: string;
}): Promise<TopicType> => {
    const response = await axios.get(`topics/${id}`, {
        params: locale ? { locale: locale } : {},
    });
    return response.data;
};

type useOptions = {
    id: string;
    locale?: string;
    options?: QueryConfigType<TopicType>;
};

export const useTopic = ({ id, locale, options }: useOptions) => {
    const cacheKey = locale ? `${id}-${locale}` : id;
    return useQuery(
        ["topics", cacheKey],
        () => getTopic({ id, locale }),
        options
    );
};
