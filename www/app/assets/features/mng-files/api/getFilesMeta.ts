import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { QueryConfigType } from "@/lib/react-query";
import { FilesMetaType } from "../types";

const getFilesMeta = async (): Promise<FilesMetaType> => {
    const response = await axios.get(`files/metadata`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<FilesMetaType>;
};

export const useFileMeta = ({ options }: useOptions = {}) => {
    return useQuery(["mng-files-meta"], () => getFilesMeta(), options);
};
