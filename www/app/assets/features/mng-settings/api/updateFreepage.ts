import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { SettingsFreepageType } from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateSettingFreepageType = { data: SettingsFreepageType };

export const updateSettingFreepage = async ({
    data,
}: UpdateSettingFreepageType): Promise<SettingsFreepageType> => {
    const response = await axios.post(`settings/freepages-update`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        SettingsFreepageType,
        UpdateSettingFreepageType,
        {
            previousData: SettingsFreepageType | undefined;
        }
    >;
};

export const useUpdateSettingFreepage = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateSettingFreepage, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["mng-setting-freepage"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<SettingsFreepageType>(
                ["mng-setting-freepage"]
            );

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["mng-setting-freepage"], {
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
                    ["mng-setting-freepage"],
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
            queryClient.invalidateQueries(["mng-setting-freepage"]);
        },
        ...config,
    });
};