import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { DayWorkFormValuesType, DayWorkListType, DayWorkType } from "../types";
import { useToast } from "@chakra-ui/react";

export type CreateDayWorkType = { data: DayWorkFormValuesType };

export const createDayWork = async ({
    data,
}: CreateDayWorkType): Promise<DayWorkType> => {
    const response = await axios.post(`day-works`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        DayWorkType,
        CreateDayWorkType,
        {
            previousData: DayWorkListType | undefined;
        }
    >;
};

export const useCreateDayWork = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(createDayWork, {
        onMutate: async (newData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["day-works"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<DayWorkListType>([
                "day-works",
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["day-works"], {
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
                queryClient.setQueryData(["day-works"], context.previousData);
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
            queryClient.invalidateQueries(["day-works"]);
        },
        ...config,
    });
};
