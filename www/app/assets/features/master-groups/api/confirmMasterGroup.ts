import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType } from "@/lib/react-query";

import { MasterGroupFormValuesType } from "../types";
import { ConfirmResponseType } from "@/types";
import { useToast } from "@chakra-ui/react";

export type ConfirmMasterGroupType = {
    data: MasterGroupFormValuesType;
    id?: string
};

export const confirmMasterGroup = async ({
    data,
    id = undefined,
}: ConfirmMasterGroupType): Promise<ConfirmResponseType> => {
    const response = id
        ? await axios.post(`master-groups/confirm/${id}`, data  )
        : await axios.post(`master-groups/confirm`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ConfirmResponseType,
        ConfirmMasterGroupType,
        {
            previousData: undefined;
        }
    >;
};

export const useConfirmMasterGroup = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(confirmMasterGroup, {
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
