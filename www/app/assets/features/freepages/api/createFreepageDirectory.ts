import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import {
    FreepageDirectoryFormValuesType,
    FreepageDirectoryListType,
    FreepageDirectoryType,
} from "../types";
import { useToast } from "@chakra-ui/react";

export type CreateFreepageDirectoryType = {
    data: FreepageDirectoryFormValuesType;
};

export const createFreepageDirectory = async ({
    data,
}: CreateFreepageDirectoryType): Promise<FreepageDirectoryType> => {
    const response = await axios.post(`freepage-directories`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        FreepageDirectoryType,
        CreateFreepageDirectoryType,
        {
            previousData: FreepageDirectoryListType | undefined;
        }
    >;
};

export const useCreateFreepageDirectory = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(createFreepageDirectory, {
        onMutate: async (newData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["freepage-all-directories"]);

            // Snapshot the previous value
            const previousData =
                queryClient.getQueryData<FreepageDirectoryListType>([
                    "freepage-all-directories",
                ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["freepage-all-directories"], {
                    data: [...(previousData.data || []), newData.data],
                });
            }

            // Return a context object with the snapshotted value
            return { previousData };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(
                    ["freepage-all-directories"],
                    context.previousData
                );
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
            queryClient.invalidateQueries(["freepage-all-directories"]);
            queryClient.invalidateQueries(["freepage-directories-meta"]);
        },
        ...config,
    });
};
