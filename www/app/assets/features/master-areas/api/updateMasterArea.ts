import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { MasterAreaFormValuesType, MasterAreaType } from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateMasterAreaType = {
    data: MasterAreaFormValuesType;
    id: string;
};

export const updateMasterArea = async ({
    data,
    id,
}: UpdateMasterAreaType): Promise<MasterAreaType> => {
    const response = await axios.post(`master-areas/${id}`, data, {
        headers: { "X-Http-Method-Override": "PATCH" },
    });
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        MasterAreaType,
        UpdateMasterAreaType,
        {
            previousData: MasterAreaType | undefined;
        }
    >;
};

export const useUpdateMasterArea = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateMasterArea, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["master-areas"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<MasterAreaType>([
                "master-areas",
                updateData.id,
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["master-areas", updateData.id], {
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
                    ["master-areas", context.previousData.id],
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
            queryClient.invalidateQueries(["master-areas"]);
        },
        ...config,
    });
};
