import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { EventType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getEvent = async ({ id }: { id: string }): Promise<EventType> => {
    const response = await axios.get(`events/${id}`);
    return response.data;
};

type useOptions = {
    id: string;
    options?: QueryConfigType<EventType>;
};

export const useEvent = ({ id, options }: useOptions) => {
    return useQuery(["events", id], () => getEvent({ id }), options);
};
