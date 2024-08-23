import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { QueryConfigType } from "@/lib/react-query";
import { TopImageMetaType } from "../types";

const getTopImageMeta = async (): Promise<TopImageMetaType> => {
    const response = await axios.get(`top-images/metadata`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<TopImageMetaType>;
};

export const useTopImageMeta = ({ options }: useOptions = {}) => {
    return useQuery(
        ["top-images-meta"],
        () => getTopImageMeta(),
        options
    );
};

