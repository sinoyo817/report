import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { AssetFormValuesType, AssetType } from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateAssetType = { data: AssetFormValuesType; id: string };

export const updateAsset = async ({
    data,
    id,
}: UpdateAssetType): Promise<AssetType> => {
    const response = await axios.post(`assets/${id}`, data, {
        headers: { "X-Http-Method-Override": "PATCH" },
    });
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        AssetType,
        UpdateAssetType,
        {
            previousData: AssetType | undefined;
        }
    >;
};

export const useUpdateAsset = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateAsset, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["mng-assets"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<AssetType>([
                "mng-assets",
                updateData.id,
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["mng-assets", updateData.id], {
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
                    ["mng-assets", context.previousData.id],
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
            queryClient.invalidateQueries(["mng-assets"]);
        },
        ...config,
    });
};
