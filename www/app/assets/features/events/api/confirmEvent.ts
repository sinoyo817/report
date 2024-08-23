import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType } from "@/lib/react-query";

import { EventFormValuesType } from "../types";
import { ConfirmResponseType } from "@/types";
import { useToast } from "@chakra-ui/react";

export type ConfirmEventType = { data: EventFormValuesType; id?: string };

export const confirmEvent = async ({
    data,
    id = undefined,
}: ConfirmEventType): Promise<ConfirmResponseType> => {
    const response = id
        ? await axios.post(`events/confirm/${id}`, data)
        : await axios.post(`events/confirm`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ConfirmResponseType,
        ConfirmEventType,
        {
            previousData: undefined;
        }
    >;
};

export const useConfirmEvent = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(confirmEvent, {
        onError: (error, variables, context) => {
            toast({
                position: "top",
                title: `確認に失敗しました`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
        ...config,
    });
};
