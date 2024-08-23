import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { BunnerType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getBunner = async ({
    id
    ,locale }: {
        id: string;
        locale?: string; 
    }): Promise<BunnerType> => {
    const response = await axios.get(`bunners/${id}` , {
        params: locale ? { locale: locale } : {},
    });
    return response.data;
};

type useOptions = {
    id: string;
     locale?: string;
    options?: QueryConfigType<BunnerType>;
};

export const useBunner = ({ id, options , locale }: useOptions) => {

    const cacheKey = locale ? `${id}-${locale}` : id;
    return useQuery(
        ["bunners", cacheKey],
        () => getBunner({ id, locale }),
        options
    );

};
