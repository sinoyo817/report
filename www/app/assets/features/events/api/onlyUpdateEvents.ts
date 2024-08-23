import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { EventType } from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateEventsType = {
    data: Partial<EventType>;
    id: string;
};

export const onlyUpdateEvents = async ({
    data,
    id,
}: UpdateEventsType): Promise<EventType> => {
    const response = await axios.post(`events/only-edit/${id}`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        EventType,
        UpdateEventsType,
        {
            previousData: EventType | undefined;
        }
    >;
};

export const useOnlyUpdateEvents = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(onlyUpdateEvents, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["events"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<EventType>([
                "events",
                updateData.id,
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["events", updateData.id], {
                    ...previousData,
                    ...updateData.data,
                    id: updateData.id,
                });
            }

            // Return a context object with the snapshotted value
            return { previousData };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(
                    ["events", context.previousData.id],
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
            queryClient.invalidateQueries(["events"]);
        },
        ...config,
    });
};
