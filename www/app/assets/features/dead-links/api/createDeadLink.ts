import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { DeadLinkFormValuesType, DeadLinkListType, DeadLinkType } from "../types";
import { useToast } from "@chakra-ui/react";

export type CreateDeadLinkType = { data: DeadLinkFormValuesType };

export const createDeadLink = async ({
    data,
}: CreateDeadLinkType): Promise<DeadLinkType> => {
    const response = await axios.post(`dead-links`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        DeadLinkType,
        CreateDeadLinkType,
        {
            previousData: DeadLinkListType | undefined;
        }
    >;
};

export const useCreateDeadLink = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(createDeadLink, {
        onMutate: async (newData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["dead-links"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<DeadLinkListType>([
                "dead-links",
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["dead-links"], {
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
                queryClient.setQueryData(["dead-links"], context.previousData);
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
            queryClient.invalidateQueries(["dead-links"]);
        },
        ...config,
    });
};
