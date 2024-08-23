import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType } from "@/lib/react-query";

import { MasterTopicCategoryFormValuesType } from "../types";
import { ConfirmResponseType } from "@/types";
import { useToast } from "@chakra-ui/react";

export type ConfirmMasterTopicCategoryType = {
    data: MasterTopicCategoryFormValuesType;
    id?: string;
};

export const confirmMasterTopicCategory = async ({
    data,
    id = undefined,
}: ConfirmMasterTopicCategoryType): Promise<ConfirmResponseType> => {
    const response = id
        ? await axios.post(`master-topic-categories/confirm/${id}`, data)
        : await axios.post(`master-topic-categories/confirm`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ConfirmResponseType,
        ConfirmMasterTopicCategoryType,
        {
            previousData: undefined;
        }
    >;
};

export const useConfirmMasterTopicCategory = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(confirmMasterTopicCategory, {
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
