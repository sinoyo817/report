import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { FileFilterParamType, FileListType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

type getFilesProp = {
    filters?: FileFilterParamType;
};

const getFiles = async ({ filters }: getFilesProp): Promise<FileListType> => {
    const response = await axios.get("files", { params: filters });
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<FileListType>;
    filters?: FileFilterParamType;
};

export const useFiles = (props: useOptions) => {
    const { filters = {}, options = {} } = props;
    return useQuery(
        [
            "files",
            Object.keys(filters).length > 0 ? JSON.stringify(filters) : "all",
        ],
        () => getFiles({ filters: { ...filters } }),
        options
    );
};
