import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { MasterEventCategoryType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getMasterEventCategory = async ({ id }: { id: string }): Promise<MasterEventCategoryType> => {
    const response = await axios.get(`master-event-categories/${id}`);
    return response.data;
};

type useOptions = {
    id: string;
    options?: QueryConfigType<MasterEventCategoryType>;
};

export const useMasterEventCategory = ({ id, options }: useOptions) => {
    return useQuery(["master-event-categories", id], () => getMasterEventCategory({ id }), options);
};
