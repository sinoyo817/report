import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { SettingsContactType } from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateSettingContactType = { data: SettingsContactType };

export const updateSettingContact = async ({
    data,
}: UpdateSettingContactType): Promise<SettingsContactType> => {
    const response = await axios.post(`settings/contacts-update`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        SettingsContactType,
        UpdateSettingContactType,
        {
            previousData: SettingsContactType | undefined;
        }
    >;
};

export const useUpdateSettingContact = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateSettingContact, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["mng-setting-contact"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<SettingsContactType>([
                "mng-setting-contact",
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["mng-setting-contact"], {
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
                    ["mng-setting-contact"],
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
            queryClient.invalidateQueries(["mng-setting-contact"]);
        },
        ...config,
    });
};
