import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { QueryConfigType } from "@/lib/react-query";
import { DayWorkMetaType } from "../types";

const getDayWorkMeta = async (): Promise<DayWorkMetaType> => {
    const response = await axios.get(`day-works/metadata`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<DayWorkMetaType>;
};

export const useDayWorkMeta = ({ options }: useOptions = {}) => {
    return useQuery(
        ["day-works-meta"],
        () => getDayWorkMeta(),
        options
    );
};

