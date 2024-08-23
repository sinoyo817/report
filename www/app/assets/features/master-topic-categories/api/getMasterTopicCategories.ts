import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import {
    MasterTopicCategoryFilterParamType,
    MasterTopicCategoryListType,
} from "../types";
import { QueryConfigType } from "@/lib/react-query";

type getOptions = {
    filters?: MasterTopicCategoryFilterParamType;
};

const getMasterTopicCategories = async ({
    filters,
}: getOptions): Promise<MasterTopicCategoryListType> => {
    const response = await axios.get("master-topic-categories", {
        params: filters,
    });
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<MasterTopicCategoryListType>;
    filters?: MasterTopicCategoryFilterParamType;
};

export const useMasterTopicCategories = (props: useOptions) => {
    const { filters = {}, options = {} } = props;
    return useQuery(
        [
            "master-topic-categories",
            Object.keys(filters).length > 0 ? JSON.stringify(filters) : "all",
        ],
        () => getMasterTopicCategories({ filters: { ...filters } }),
        options
    );
};
