import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { TopicFormValuesType, TopicListType, TopicType } from "../types";
import { useToast } from "@chakra-ui/react";

export type CreateTopicType = { data: TopicFormValuesType };

export const createTopic = async ({
    data,
}: CreateTopicType): Promise<TopicType> => {
    const response = await axios.post(`topics`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        TopicType,
        CreateTopicType,
        {
            previousData: TopicListType | undefined;
        }
    >;
};

export const useCreateTopic = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(createTopic, {
        onMutate: async (newData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["topics"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<TopicListType>([
                "topics",
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["topics"], {
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
                queryClient.setQueryData(["topics"], context.previousData);
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
            queryClient.invalidateQueries(["topics"]);
        },
        ...config,
    });
};
