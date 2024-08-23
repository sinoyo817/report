import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { SettingsGeneralType } from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateSettingGeneralType = { data: SettingsGeneralType };

export const updateSettingGeneral = async ({
    data,
}: UpdateSettingGeneralType): Promise<SettingsGeneralType> => {
    const response = await axios.post(`settings/general-update`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        SettingsGeneralType,
        UpdateSettingGeneralType,
        {
            previousData: SettingsGeneralType | undefined;
        }
    >;
};

export const useUpdateSettingGeneral = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateSettingGeneral, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["mng-setting-general"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<SettingsGeneralType>([
                "mng-setting-general",
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["mng-setting-general"], {
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
                    ["mng-setting-general"],
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
            queryClient.invalidateQueries(["mng-setting-general"]);
        },
        ...config,
    });
};
