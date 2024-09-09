import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { ToDoFilterParamType, ToDoListType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

type getOptions = {
    filters?: ToDoFilterParamType;
};

const getToDos = async ({ filters }: getOptions): Promise<ToDoListType> => {
    const response = await axios.get("to-dos", { params: filters });
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<ToDoListType>;
    filters?: ToDoFilterParamType;
};

export const useToDos = (props: useOptions) => {
    const { filters = {}, options = {} } = props;
    return useQuery(
        [
            "to-dos",
            Object.keys(filters).length > 0 ? JSON.stringify(filters) : "all",
        ],
        () => getToDos({ filters: { ...filters } }),
        options
    );
};
