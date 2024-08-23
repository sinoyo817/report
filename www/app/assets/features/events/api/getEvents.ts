import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { EventFilterParamType, EventListType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

type getOptions = {
    filters?: EventFilterParamType;
};

const getEvents = async ({ filters }: getOptions): Promise<EventListType> => {
    const response = await axios.get("events", { params: filters });
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<EventListType>;
    filters?: EventFilterParamType;
};

export const useEvents = (props: useOptions) => {
    const { filters = {}, options = {} } = props;
    return useQuery(
        [
            "events",
            Object.keys(filters).length > 0 ? JSON.stringify(filters) : "all",
        ],
        () => getEvents({ filters: { ...filters } }),
        options
    );
};
