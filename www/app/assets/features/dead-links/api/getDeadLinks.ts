import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { DeadLinkFilterParamType, DeadLinkListType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

type getOptions = {
    filters?: DeadLinkFilterParamType;
};

const getDeadLinks = async ({ filters }: getOptions): Promise<DeadLinkListType> => {
    const response = await axios.get("dead-links", { params: filters });
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<DeadLinkListType>;
    filters?: DeadLinkFilterParamType;
};

export const useDeadLinks = (props: useOptions) => {
    const { filters = {}, options = {} } = props;
    return useQuery(
        [
            "dead-links",
            Object.keys(filters).length > 0 ? JSON.stringify(filters) : "all",
        ],
        () => getDeadLinks({ filters: { ...filters } }),
        options
    );
};
