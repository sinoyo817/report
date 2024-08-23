import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { AdminFormValuesType, AdminListType, AdminType } from "../types";
import { useToast } from "@chakra-ui/react";

export type CreateAdminType = { data: AdminFormValuesType };

export const createAdmin = async ({
    data,
}: CreateAdminType): Promise<AdminType> => {
    const response = await axios.post(`admins`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        AdminType,
        CreateAdminType,
        {
            previousData: AdminListType | undefined;
        }
    >;
};

export const useCreateAdmin = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(createAdmin, {
        onMutate: async (newData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["admins"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<AdminListType>([
                "admins",
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["admins"], {
                    data: [...(previousData.data || []), newData.data],
                    collection: previousData.collection,
                });
            }

            // Return a context object with the snapshotted value
            return { previousData };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error, valiables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["admins"], context.previousData);
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
            queryClient.invalidateQueries(["admins"]);
        },
        ...config,
    });
};
