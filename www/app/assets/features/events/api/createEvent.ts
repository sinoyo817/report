import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { EventFormValuesType, EventListType, EventType } from "../types";
import { useToast } from "@chakra-ui/react";

export type CreateEventType = { data: EventFormValuesType };

export const createEvent = async ({
    data,
}: CreateEventType): Promise<EventType> => {
    const response = await axios.post(`events`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        EventType,
        CreateEventType,
        {
            previousData: EventListType | undefined;
        }
    >;
};

export const useCreateEvent = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(createEvent, {
        onMutate: async (newData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["events"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<EventListType>([
                "events",
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["events"], {
                    data: [...(previousData.data || []), newData.data],
                    collection: previousData.collection,
                });
            }

            // Return a context object with the snapshotted value
            return { previousData };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["events"], context.previousData);
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
            queryClient.invalidateQueries(["events"]);
        },
        ...config,
    });
};
