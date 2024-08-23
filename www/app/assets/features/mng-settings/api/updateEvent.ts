import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { SettingsEventType } from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateSettingEventType = { data: SettingsEventType };

export const updateSettingEvent = async ({
    data,
}: UpdateSettingEventType): Promise<SettingsEventType> => {
    const response = await axios.post(`settings/events-update`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        SettingsEventType,
        UpdateSettingEventType,
        {
            previousData: SettingsEventType | undefined;
        }
    >;
};

export const useUpdateSettingEvent = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateSettingEvent, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["mng-setting-event"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<SettingsEventType>([
                "mng-setting-event",
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["mng-setting-event"], {
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
                    ["mng-setting-event"],
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
            queryClient.invalidateQueries(["mng-setting-event"]);
        },
        ...config,
    });
};
