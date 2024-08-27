import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { DayWorkFormValuesType, DayWorkType } from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateDayWorkType = {
    data: DayWorkFormValuesType;
    id: string;
     
};

export const updateDayWork = async ({
    data,
    id,
     
}: UpdateDayWorkType): Promise<DayWorkType> => {
    const response = await axios.post(`day-works/${id}`, data, {
        headers: { "X-Http-Method-Override": "PATCH" },
         
    });
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        DayWorkType,
        UpdateDayWorkType,
        {
            previousData: DayWorkType | undefined;
        }
    >;
};

export const useUpdateDayWork = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateDayWork, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["day-works"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<DayWorkType>([
                "day-works",
                updateData.id,
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["day-works", updateData.id], {
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
                    ["day-works", context.previousData.id],
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
            queryClient.invalidateQueries(["day-works"]);
        },
        ...config,
    });
};
