import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType } from "@/lib/react-query";

import { DayWorkFormValuesType } from "../types";
import { ConfirmResponseType } from "@/types";
import { useToast } from "@chakra-ui/react";

export type ConfirmDayWorkType = {
    data: DayWorkFormValuesType;
    id?: string
    
};

export const confirmDayWork = async ({
    data,
    id = undefined,
     
}: ConfirmDayWorkType): Promise<ConfirmResponseType> => {
    const response = id
        ? await axios.post(`day-works/confirm/${id}`, data  )
        : await axios.post(`day-works/confirm`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ConfirmResponseType,
        ConfirmDayWorkType,
        {
            previousData: undefined;
        }
    >;
};

export const useConfirmDayWork = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(confirmDayWork, {
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
