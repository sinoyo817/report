import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { MasterProductCodeFormValuesType, MasterProductCodeListType, MasterProductCodeType } from "../types";
import { useToast } from "@chakra-ui/react";

export type CreateMasterProductCodeType = { data: MasterProductCodeFormValuesType };

export const createMasterProductCode = async ({
    data,
}: CreateMasterProductCodeType): Promise<MasterProductCodeType> => {
    const response = await axios.post(`master-product-codes`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        MasterProductCodeType,
        CreateMasterProductCodeType,
        {
            previousData: MasterProductCodeListType | undefined;
        }
    >;
};

export const useCreateMasterProductCode = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(createMasterProductCode, {
        onMutate: async (newData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["master-product-codes"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<MasterProductCodeListType>([
                "master-product-codes",
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["master-product-codes"], {
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
                queryClient.setQueryData(["master-product-codes"], context.previousData);
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
            queryClient.invalidateQueries(["master-product-codes"]);
        },
        ...config,
    });
};
