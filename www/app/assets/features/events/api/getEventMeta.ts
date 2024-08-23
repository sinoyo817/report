import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { QueryConfigType } from "@/lib/react-query";
import { EventMetaType } from "../types";

const getEventMeta = async (): Promise<EventMetaType> => {
    const response = await axios.get(`events/metadata`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<EventMetaType>;
};

export const useEventMeta = ({ options }: useOptions = {}) => {
    return useQuery(
        ["events-meta"],
        () => getEventMeta(),
        options
    );
};

