import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { MasterWorkCodeFormValuesType, MasterWorkCodeType } from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateMasterWorkCodeType = {
    data: MasterWorkCodeFormValuesType;
    id: string;
     
};

export const updateMasterWorkCode = async ({
    data,
    id,
     
}: UpdateMasterWorkCodeType): Promise<MasterWorkCodeType> => {
    const response = await axios.post(`master-work-codes/${id}`, data, {
        headers: { "X-Http-Method-Override": "PATCH" },
         
    });
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        MasterWorkCodeType,
        UpdateMasterWorkCodeType,
        {
            previousData: MasterWorkCodeType | undefined;
        }
    >;
};

export const useUpdateMasterWorkCode = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateMasterWorkCode, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["master-work-codes"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<MasterWorkCodeType>([
                "master-work-codes",
                updateData.id,
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["master-work-codes", updateData.id], {
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
                    ["master-work-codes", context.previousData.id],
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
            queryClient.invalidateQueries(["master-work-codes"]);
        },
        ...config,
    });
};
