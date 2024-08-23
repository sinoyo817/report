import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { MasterAreaFilterParamType, MasterAreaListType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

type getOptions = {
    filters?: MasterAreaFilterParamType;
};

const getMasterAreas = async ({
    filters,
}: getOptions): Promise<MasterAreaListType> => {
    const response = await axios.get("master-areas", { params: filters });
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<MasterAreaListType>;
    filters?: MasterAreaFilterParamType;
};

export const useMasterAreas = (props: useOptions) => {
    const { filters = {}, options = {} } = props;
    return useQuery(
        [
            "master-areas",
            Object.keys(filters).length > 0 ? JSON.stringify(filters) : "all",
        ],
        () => getMasterAreas({ filters: { ...filters } }),
        options
    );
};
