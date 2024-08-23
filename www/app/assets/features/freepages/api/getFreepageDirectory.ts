import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { FreepageDirectoryType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getFreepageDirectory = async ({
    id,
}: {
    id: string;
}): Promise<FreepageDirectoryType> => {
    const response = await axios.get(`freepage-directories/${id}`);
    return response.data;
};

type useOptions = {
    id: string;
    options?: QueryConfigType<FreepageDirectoryType>;
};

export const useFreepageDirectory = ({ id, options }: useOptions) => {
    return useQuery(
        ["freepage-directories", id],
        () => getFreepageDirectory({ id }),
        options
    );
};
