import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType } from "@/lib/react-query";

import { ToDoFormValuesType } from "../types";
import { ConfirmResponseType } from "@/types";
import { useToast } from "@chakra-ui/react";

export type ConfirmToDoType = {
    data: ToDoFormValuesType;
    id?: string
    
};

export const confirmToDo = async ({
    data,
    id = undefined,
     
}: ConfirmToDoType): Promise<ConfirmResponseType> => {
    const response = id
        ? await axios.post(`to-dos/confirm/${id}`, data  )
        : await axios.post(`to-dos/confirm`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ConfirmResponseType,
        ConfirmToDoType,
        {
            previousData: undefined;
        }
    >;
};

export const useConfirmToDo = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(confirmToDo, {
        onError: (error, variables, context) => {
            toast({
                position: "top",
                title: `確認に失敗しました`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
        ...config,
    });
};
