import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { FreepageDocumentType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getFreepageDocument = async ({
    id,
}: {
    id: string;
}): Promise<FreepageDocumentType> => {
    const response = await axios.get(`freepage-documents/${id}`);
    return response.data;
};

type useOptions = {
    id: string;
    options?: QueryConfigType<FreepageDocumentType>;
};

export const useFreepageDocument = ({ id, options }: useOptions) => {
    return useQuery(
        ["freepage-documents", id],
        () => getFreepageDocument({ id }),
        options
    );
};
