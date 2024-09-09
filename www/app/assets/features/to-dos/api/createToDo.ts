import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { ToDoFormValuesType, ToDoListType, ToDoType } from "../types";
import { useToast } from "@chakra-ui/react";

export type CreateToDoType = { data: ToDoFormValuesType };

export const createToDo = async ({
    data,
}: CreateToDoType): Promise<ToDoType> => {
    const response = await axios.post(`to-dos`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ToDoType,
        CreateToDoType,
        {
            previousData: ToDoListType | undefined;
        }
    >;
};

export const useCreateToDo = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(createToDo, {
        onMutate: async (newData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["to-dos"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<ToDoListType>([
                "to-dos",
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["to-dos"], {
                    data: [...(previousData.data || []), newData.data],
                    collection: previousData.collection,
                });
            }

            // Return a context object with the snapshotted value
            return { previousData };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["to-dos"], context.previousData);
            }
            toast({
                position: "top",
                title: `登録に失敗しました`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
        onSuccess(data, variables, context) {
            toast({
                position: "top",
                title: `登録に成功しました`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries(["to-dos"]);
        },
        ...config,
    });
};
