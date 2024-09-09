import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { QueryConfigType } from "@/lib/react-query";
import { ToDoMetaType } from "../types";

const getToDoMeta = async (): Promise<ToDoMetaType> => {
    const response = await axios.get(`to-dos/metadata`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<ToDoMetaType>;
};

export const useToDoMeta = ({ options }: useOptions = {}) => {
    return useQuery(
        ["to-dos-meta"],
        () => getToDoMeta(),
        options
    );
};

