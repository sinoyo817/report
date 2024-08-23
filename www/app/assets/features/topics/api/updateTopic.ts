import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { TopicFormValuesType, TopicType } from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateTopicType = {
    data: TopicFormValuesType;
    id: string;
    locale?: string;
};

export const updateTopic = async ({
    data,
    id,
    locale,
}: UpdateTopicType): Promise<TopicType> => {
    const response = await axios.post(`topics/${id}`, data, {
        headers: { "X-Http-Method-Override": "PATCH" },
        params: locale ? { locale: locale } : {},
    });
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        TopicType,
        UpdateTopicType,
        {
            previousData: TopicType | undefined;
        }
    >;
};

export const useUpdateTopic = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateTopic, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["topics"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<TopicType>([
                "topics",
                updateData.id,
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["topics", updateData.id], {
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
                    ["topics", context.previousData.id],
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
            queryClient.invalidateQueries(["topics"]);
        },
        ...config,
    });
};
