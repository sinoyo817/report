import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { DeadLinkType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getDeadLink = async ({ id }: { id: string }): Promise<DeadLinkType> => {
    const response = await axios.get(`dead-links/${id}`);
    return response.data;
};

type useOptions = {
    id: string;
    options?: QueryConfigType<DeadLinkType>;
};

export const useDeadLink = ({ id, options }: useOptions) => {
    return useQuery(["dead-links", id], () => getDeadLink({ id }), options);
};
