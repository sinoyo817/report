import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { ToDoFormValuesType, ToDoType } from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateToDoType = {
    data: ToDoFormValuesType;
    id: string;
     
};

export const updateToDo = async ({
    data,
    id,
     
}: UpdateToDoType): Promise<ToDoType> => {
    const response = await axios.post(`to-dos/${id}`, data, {
        headers: { "X-Http-Method-Override": "PATCH" },
         
    });
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ToDoType,
        UpdateToDoType,
        {
            previousData: ToDoType | undefined;
        }
    >;
};

export const useUpdateToDo = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateToDo, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["to-dos"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<ToDoType>([
                "to-dos",
                updateData.id,
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["to-dos", updateData.id], {
                    ...previousData,
                    ...updateData.data,
                    id: updateData.id,
                });
            }

            // Return a context object with the snapshotted value
            return { previousData };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(
                    ["to-dos", context.previousData.id],
                    context.previousData
                );
            }
            toast({
                position: "top",
                title: `更新に失敗しました`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
        onSuccess(data, variables, context) {
            //
            toast({
                position: "top",
                title: `更新に成功しました`,
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
