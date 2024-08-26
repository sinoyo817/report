import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { MasterWorkCodeFormValuesType, MasterWorkCodeListType, MasterWorkCodeType } from "../types";
import { useToast } from "@chakra-ui/react";

export type CreateMasterWorkCodeType = { data: MasterWorkCodeFormValuesType };

export const createMasterWorkCode = async ({
    data,
}: CreateMasterWorkCodeType): Promise<MasterWorkCodeType> => {
    const response = await axios.post(`master-work-codes`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        MasterWorkCodeType,
        CreateMasterWorkCodeType,
        {
            previousData: MasterWorkCodeListType | undefined;
        }
    >;
};

export const useCreateMasterWorkCode = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(createMasterWorkCode, {
        onMutate: async (newData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["master-work-codes"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<MasterWorkCodeListType>([
                "master-work-codes",
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["master-work-codes"], {
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
                queryClient.setQueryData(["master-work-codes"], context.previousData);
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
            queryClient.invalidateQueries(["master-work-codes"]);
        },
        ...config,
    });
};
