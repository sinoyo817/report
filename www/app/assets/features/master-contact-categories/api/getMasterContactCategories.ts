import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import {
    MasterContactCategoryFilterParamType,
    MasterContactCategoryListType,
} from "../types";
import { QueryConfigType } from "@/lib/react-query";

type getOptions = {
    filters?: MasterContactCategoryFilterParamType;
};

const getMasterContactCategories = async ({
    filters,
}: getOptions): Promise<MasterContactCategoryListType> => {
    const response = await axios.get("master-contact-categories", {
        params: filters,
    });
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<MasterContactCategoryListType>;
    filters?: MasterContactCategoryFilterParamType;
};

export const useMasterContactCategories = (props: useOptions) => {
    const { filters = {}, options = {} } = props;
    return useQuery(
        [
            "master-contact-categories",
            Object.keys(filters).length > 0 ? JSON.stringify(filters) : "all",
        ],
        () => getMasterContactCategories({ filters: { ...filters } }),
        options
    );
};
