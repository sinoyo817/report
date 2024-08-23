import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import {
    MasterContactCategoryFormValuesType,
    MasterContactCategoryType,
} from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateMasterContactCategoryType = {
    data: MasterContactCategoryFormValuesType;
    id: string;
};

export const updateMasterContactCategory = async ({
    data,
    id,
}: UpdateMasterContactCategoryType): Promise<MasterContactCategoryType> => {
    const response = await axios.post(`master-contact-categories/${id}`, data, {
        headers: { "X-Http-Method-Override": "PATCH" },
    });
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        MasterContactCategoryType,
        UpdateMasterContactCategoryType,
        {
            previousData: MasterContactCategoryType | undefined;
        }
    >;
};

export const useUpdateMasterContactCategory = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateMasterContactCategory, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["master-contact-categories"]);

            // Snapshot the previous value
            const previousData =
                queryClient.getQueryData<MasterContactCategoryType>([
                    "master-contact-categories",
                    updateData.id,
                ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(
                    ["master-contact-categories", updateData.id],
                    {
                        ...previousData,
                        ...updateData.data,
                        id: updateData.id,
                    }
                );
            }

            // Return a context object with the snapshotted value
            return { previousData };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(
                    ["master-contact-categories", context.previousData.id],
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
            queryClient.invalidateQueries(["master-contact-categories"]);
        },
        ...config,
    });
};
