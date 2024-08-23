import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { AdminFormValuesType, AdminType } from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateAdminType = { data: AdminFormValuesType; id: string };

export const updateAdmin = async ({
    data,
    id,
}: UpdateAdminType): Promise<AdminType> => {
    const response = await axios.post(`admins/${id}`, data, {
        headers: { "X-Http-Method-Override": "PATCH" },
    });
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        AdminType,
        UpdateAdminType,
        {
            previousData: AdminType | undefined;
        }
    >;
};

export const useUpdateAdmin = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateAdmin, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["admins"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<AdminType>([
                "admins",
                updateData.id,
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["admins", updateData.id], {
                    ...previousData,
                    ...updateData.data,
                    id: updateData.id,
                });
            }

            // Return a context object with the snapshotted value
            return { previousData };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error, valiables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(
                    ["admins", context.previousData.id],
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
            queryClient.invalidateQueries(["admins"]);
        },
        ...config,
    });
};
