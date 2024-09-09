import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { ToDoType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getToDo = async ({
    id
     }: {
        id: string;
        
    }): Promise<ToDoType> => {
    const response = await axios.get(`to-dos/${id}` );
    return response.data;
};

type useOptions = {
    id: string;
     
    options?: QueryConfigType<ToDoType>;
};

export const useToDo = ({ id, options  }: useOptions) => {
     
        return useQuery(["to-dos", id], () => getToDo({ id }), options);
     

};
