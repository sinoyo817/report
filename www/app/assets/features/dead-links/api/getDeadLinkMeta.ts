import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { QueryConfigType } from "@/lib/react-query";
import { DeadLinkMetaType } from "../types";

const getDeadLinkMeta = async (): Promise<DeadLinkMetaType> => {
    const response = await axios.get(`dead-links/metadata`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<DeadLinkMetaType>;
};

export const useDeadLinkMeta = ({ options }: useOptions = {}) => {
    return useQuery(
        ["dead-links-meta"],
        () => getDeadLinkMeta(),
        options
    );
};

