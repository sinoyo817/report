import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { DeadLinkFormValuesType, DeadLinkType } from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateDeadLinkType = { data: DeadLinkFormValuesType; id: string };

export const updateDeadLink = async ({
    data,
    id,
}: UpdateDeadLinkType): Promise<DeadLinkType> => {
    const response = await axios.post(`dead-links/${id}`, data, {
        headers: { "X-Http-Method-Override": "PATCH" },
    });
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        DeadLinkType,
        UpdateDeadLinkType,
        {
            previousData: DeadLinkType | undefined;
        }
    >;
};

export const useUpdateDeadLink = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateDeadLink, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["dead-links"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<DeadLinkType>([
                "dead-links",
                updateData.id,
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["dead-links", updateData.id], {
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
                    ["dead-links", context.previousData.id],
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
            queryClient.invalidateQueries(["dead-links"]);
        },
        ...config,
    });
};
