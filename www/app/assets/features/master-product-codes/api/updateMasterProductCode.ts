import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { MasterProductCodeFormValuesType, MasterProductCodeType } from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateMasterProductCodeType = {
    data: MasterProductCodeFormValuesType;
    id: string;
     
};

export const updateMasterProductCode = async ({
    data,
    id,
}: UpdateMasterProductCodeType): Promise<MasterProductCodeType> => {
    const response = await axios.post(`master-product-codes/${id}`, data, {
        headers: { "X-Http-Method-Override": "PATCH" },
         
    });
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        MasterProductCodeType,
        UpdateMasterProductCodeType,
        {
            previousData: MasterProductCodeType | undefined;
        }
    >;
};

export const useUpdateMasterProductCode = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateMasterProductCode, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["master-product-codes"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<MasterProductCodeType>([
                "master-product-codes",
                updateData.id,
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["master-product-codes", updateData.id], {
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
                    ["master-product-codes", context.previousData.id],
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
            queryClient.invalidateQueries(["master-product-codes"]);
        },
        ...config,
    });
};
