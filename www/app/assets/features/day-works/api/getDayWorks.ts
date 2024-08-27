import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { DayWorkFilterParamType, DayWorkListType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

type getOptions = {
    filters?: DayWorkFilterParamType;
};

const getDayWorks = async ({ filters }: getOptions): Promise<DayWorkListType> => {
    const response = await axios.get("day-works", { params: filters });
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<DayWorkListType>;
    filters?: DayWorkFilterParamType;
};

export const useDayWorks = (props: useOptions) => {
    const { filters = {}, options = {} } = props;
    return useQuery(
        [
            "day-works",
            Object.keys(filters).length > 0 ? JSON.stringify(filters) : "all",
        ],
        () => getDayWorks({ filters: { ...filters } }),
        options
    );
};
