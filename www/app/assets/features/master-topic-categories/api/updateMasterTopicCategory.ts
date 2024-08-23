import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import {
    MasterTopicCategoryFormValuesType,
    MasterTopicCategoryType,
} from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateMasterTopicCategoryType = {
    data: MasterTopicCategoryFormValuesType;
    id: string;
    locale?: string;
};

export const updateMasterTopicCategory = async ({
    data,
    id,
    locale,
}: UpdateMasterTopicCategoryType): Promise<MasterTopicCategoryType> => {
    const response = await axios.post(`master-topic-categories/${id}`, data, {
        headers: { "X-Http-Method-Override": "PATCH" },
        params: locale ? { locale: locale } : {},
    });
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        MasterTopicCategoryType,
        UpdateMasterTopicCategoryType,
        {
            previousData: MasterTopicCategoryType | undefined;
        }
    >;
};

export const useUpdateMasterTopicCategory = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateMasterTopicCategory, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["master-topic-categories"]);

            // Snapshot the previous value
            const previousData =
                queryClient.getQueryData<MasterTopicCategoryType>([
                    "master-topic-categories",
                    updateData.id,
                ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(
                    ["master-topic-categories", updateData.id],
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
                    ["master-topic-categories", context.previousData.id],
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
            queryClient.invalidateQueries(["master-topic-categories"]);
        },
        ...config,
    });
};
