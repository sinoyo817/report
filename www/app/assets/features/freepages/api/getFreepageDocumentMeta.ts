import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { QueryConfigType } from "@/lib/react-query";
import { FreepageDocumentMetaType } from "../types";

const getFreepageDocumentMeta = async (): Promise<FreepageDocumentMetaType> => {
    const response = await axios.get(`freepage-documents/metadata`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<FreepageDocumentMetaType>;
};

export const useFreepageDocumentMeta = ({ options }: useOptions = {}) => {
    return useQuery(
        ["freepage-documents-meta"],
        () => getFreepageDocumentMeta(),
        options
    );
};
