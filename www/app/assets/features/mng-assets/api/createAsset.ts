import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { AssetFormValuesType, AssetListType, AssetType } from "../types";
import { useToast } from "@chakra-ui/react";

export type CreateAssetType = { data: AssetFormValuesType };

export const createAsset = async ({
    data,
}: CreateAssetType): Promise<AssetType> => {
    const response = await axios.post(`assets/upload`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        AssetType,
        CreateAssetType,
        {
            previousData: AssetListType | undefined;
        }
    >;
};

export const useCreateAsset = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(createAsset, {
        onMutate: async (newData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["mng-assets"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<AssetListType>([
                "mng-assets",
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["mng-assets"], {
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
                queryClient.setQueryData(["mng-assets"], context.previousData);
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
            queryClient.invalidateQueries(["mng-assets"]);
        },
        ...config,
    });
};
