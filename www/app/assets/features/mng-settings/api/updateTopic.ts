import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { SettingsTopicType } from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateSettingTopicType = { data: SettingsTopicType };

export const updateSettingTopic = async ({
    data,
}: UpdateSettingTopicType): Promise<SettingsTopicType> => {
    const response = await axios.post(`settings/topics-update`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        SettingsTopicType,
        UpdateSettingTopicType,
        {
            previousData: SettingsTopicType | undefined;
        }
    >;
};

export const useUpdateSettingTopic = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateSettingTopic, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["mng-setting-topic"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<SettingsTopicType>([
                "mng-setting-topic",
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["mng-setting-topic"], {
                    ...previousData,
                    ...updateData.data,
                });
            }

            // Return a context object with the snapshotted value
            return { previousData };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(
                    ["mng-setting-topic"],
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
            queryClient.invalidateQueries(["mng-setting-topic"]);
        },
        ...config,
    });
};
