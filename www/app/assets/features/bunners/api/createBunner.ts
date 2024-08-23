import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { BunnerFormValuesType, BunnerListType, BunnerType } from "../types";
import { useToast } from "@chakra-ui/react";

export type CreateBunnerType = { data: BunnerFormValuesType };

export const createBunner = async ({
    data,
}: CreateBunnerType): Promise<BunnerType> => {
    const response = await axios.post(`bunners`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        BunnerType,
        CreateBunnerType,
        {
            previousData: BunnerListType | undefined;
        }
    >;
};

export const useCreateBunner = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(createBunner, {
        onMutate: async (newData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["bunners"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<BunnerListType>([
                "bunners",
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["bunners"], {
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
                queryClient.setQueryData(["bunners"], context.previousData);
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
            queryClient.invalidateQueries(["bunners"]);
        },
        ...config,
    });
};
