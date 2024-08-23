import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType } from "@/lib/react-query";

import { MasterContactCategoryFormValuesType } from "../types";
import { ConfirmResponseType } from "@/types";
import { useToast } from "@chakra-ui/react";

export type ConfirmMasterContactCategoryType = {
    data: MasterContactCategoryFormValuesType;
    id?: string;
};

export const confirmMasterContactCategory = async ({
    data,
    id = undefined,
}: ConfirmMasterContactCategoryType): Promise<ConfirmResponseType> => {
    const response = id
        ? await axios.post(`master-contact-categories/confirm/${id}`, data)
        : await axios.post(`master-contact-categories/confirm`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ConfirmResponseType,
        ConfirmMasterContactCategoryType,
        {
            previousData: undefined;
        }
    >;
};

export const useConfirmMasterContactCategory = ({
    config,
}: useOptions = {}) => {
    const toast = useToast();
    return useMutation(confirmMasterContactCategory, {
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
