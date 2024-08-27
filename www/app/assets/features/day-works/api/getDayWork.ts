import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { DayWorkType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getDayWork = async ({
    id
     }: {
        id: string;
        
    }): Promise<DayWorkType> => {
    const response = await axios.get(`day-works/${id}` );
    return response.data;
};

type useOptions = {
    id: string;
     
    options?: QueryConfigType<DayWorkType>;
};

export const useDayWork = ({ id, options  }: useOptions) => {
     
        return useQuery(["day-works", id], () => getDayWork({ id }), options);
     

};
