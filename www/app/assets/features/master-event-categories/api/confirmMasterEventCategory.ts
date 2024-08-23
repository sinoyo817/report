import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType } from "@/lib/react-query";

import { MasterEventCategoryFormValuesType } from "../types";
import { ConfirmResponseType } from "@/types";
import { useToast } from "@chakra-ui/react";

export type ConfirmMasterEventCategoryType = { data: MasterEventCategoryFormValuesType; id?: string };

export const confirmMasterEventCategory = async ({
    data,
    id = undefined,
}: ConfirmMasterEventCategoryType): Promise<ConfirmResponseType> => {
    const response = id
        ? await axios.post(`master-event-categories/confirm/${id}`, data)
        : await axios.post(`master-event-categories/confirm`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ConfirmResponseType,
        ConfirmMasterEventCategoryType,
        {
            previousData: undefined;
        }
    >;
};

export const useConfirmMasterEventCategory = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(confirmMasterEventCategory, {
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
