import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { StatusChangeResoponseType } from "@/config";
import { useToast } from "@chakra-ui/react";
import { useStatusOptions } from "../hooks/useStatusOptions";

export type StatusChangeType = {
    data: {
        ids: string[];
        status: string;
        summary?: string;
    };
    contentsKey: string;
};

export const statusChange = async ({
    data,
    contentsKey,
}: StatusChangeType): Promise<StatusChangeResoponseType> => {
    const response = await axios.post(`${contentsKey}/status`, data);
    return response.data;
};

type useStatusChangeOptions<TList> = {
    config?: MutationConfigType<
        StatusChangeResoponseType,
        StatusChangeType,
        {
            previousData: TList | undefined;
        }
    >;
};

export const useStatusChange = <TList>({
    config,
}: useStatusChangeOptions<TList> = {}) => {
    const toast = useToast();
    const statusOptions = useStatusOptions();
    return useMutation(statusChange, {
        onMutate: async (statusChangeData) => {
            // When mutate is called:
            await queryClient.cancelQueries([statusChangeData.contentsKey]);

            // // Snapshot the previous value
            const previousData = queryClient.getQueryData<TList>([
                statusChangeData.contentsKey,
            ]);

            // // Return a context object with the snapshotted value
            return { previousData };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error, variables, context) => {
            const statusData =
                statusOptions &&
                statusOptions.find(
                    (item) => item.status === variables.data.status
                );
            const statusTxt = statusData ? statusData.title : "";
            if (context?.previousData) {
                queryClient.setQueryData(
                    [variables.contentsKey],
                    context.previousData
                );
            }
            toast({
                position: "top",
                title: `${statusTxt}処理に失敗しました`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
        onSuccess(data, variables, context) {
            const statusData =
                statusOptions &&
                statusOptions.find(
                    (item) => item.status === variables.data.status
                );
            const statusTxt = statusData ? statusData.title : "";
            toast({
                position: "top",
                title: `${statusTxt}処理に成功しました`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        },
        // Always refetch after error or success:
        onSettled: (data, error, variables, context) => {
            queryClient.invalidateQueries([variables.contentsKey]);
        },
        ...config,
    });
};
