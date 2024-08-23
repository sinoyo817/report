import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { MasterAreaType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getMasterArea = async ({
    id,
}: {
    id: string;
}): Promise<MasterAreaType> => {
    const response = await axios.get(`master-areas/${id}`);
    return response.data;
};

type useOptions = {
    id: string;
    options?: QueryConfigType<MasterAreaType>;
};

export const useMasterArea = ({ id, options }: useOptions) => {
    return useQuery(["master-areas", id], () => getMasterArea({ id }), options);
};
