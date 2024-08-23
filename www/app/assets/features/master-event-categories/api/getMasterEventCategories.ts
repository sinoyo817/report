import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { MasterEventCategoryFilterParamType, MasterEventCategoryListType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

type getOptions = {
    filters?: MasterEventCategoryFilterParamType;
};

const getMasterEventCategories = async ({ filters }: getOptions): Promise<MasterEventCategoryListType> => {
    const response = await axios.get("master-event-categories", { params: filters });
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<MasterEventCategoryListType>;
    filters?: MasterEventCategoryFilterParamType;
};

export const useMasterEventCategories = (props: useOptions) => {
    const { filters = {}, options = {} } = props;
    return useQuery(
        [
            "master-event-categories",
            Object.keys(filters).length > 0 ? JSON.stringify(filters) : "all",
        ],
        () => getMasterEventCategories({ filters: { ...filters } }),
        options
    );
};
