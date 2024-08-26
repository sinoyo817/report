import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType } from "@/lib/react-query";

import { MasterWorkCodeFormValuesType } from "../types";
import { ConfirmResponseType } from "@/types";
import { useToast } from "@chakra-ui/react";

export type ConfirmMasterWorkCodeType = {
    data: MasterWorkCodeFormValuesType;
    id?: string
    
};

export const confirmMasterWorkCode = async ({
    data,
    id = undefined,
     
}: ConfirmMasterWorkCodeType): Promise<ConfirmResponseType> => {
    const response = id
        ? await axios.post(`master-work-codes/confirm/${id}`, data  )
        : await axios.post(`master-work-codes/confirm`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ConfirmResponseType,
        ConfirmMasterWorkCodeType,
        {
            previousData: undefined;
        }
    >;
};

export const useConfirmMasterWorkCode = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(confirmMasterWorkCode, {
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
