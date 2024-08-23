import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { TopImageType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getTopImage = async ({
    id
    ,locale }: {
        id: string;
        locale?: string; 
    }): Promise<TopImageType> => {
    const response = await axios.get(`top-images/${id}` , {
        params: locale ? { locale: locale } : {},
    });
    return response.data;
};

type useOptions = {
    id: string;
     locale?: string;
    options?: QueryConfigType<TopImageType>;
};

export const useTopImage = ({ id, options , locale }: useOptions) => {
     
        const cacheKey = locale ? `${id}-${locale}` : id;
        return useQuery(
            ["top-images", cacheKey],
            () => getTopImage({ id, locale }),
            options
        );
     

};
