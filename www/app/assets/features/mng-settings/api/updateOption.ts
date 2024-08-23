import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { SettingsOptionType } from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateSettingOptionType = { data: SettingsOptionType };

export const updateSettingOption = async ({
    data,
}: UpdateSettingOptionType): Promise<SettingsOptionType> => {
    const response = await axios.post(`settings/option-update`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        SettingsOptionType,
        UpdateSettingOptionType,
        {
            previousData: SettingsOptionType | undefined;
        }
    >;
};

export const useUpdateSettingOption = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateSettingOption, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["mng-setting-option"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<SettingsOptionType>([
                "mng-setting-option",
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["mng-setting-option"], {
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
                    ["mng-setting-option"],
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
            queryClient.invalidateQueries(["mng-setting-option"]);
        },
        ...config,
    });
};
