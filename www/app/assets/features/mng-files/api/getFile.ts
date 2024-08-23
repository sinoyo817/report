import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { FileType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getFile = async ({ id }: { id: string }): Promise<FileType> => {
    const response = await axios.get(`files/${id}`);
    return response.data;
};

type useOptions = {
    id: string;
    options?: QueryConfigType<FileType>;
};

export const useFile = ({ id, options }: useOptions) => {
    return useQuery(["files", id], () => getFile({ id }), options);
};
