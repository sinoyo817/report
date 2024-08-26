import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType } from "@/lib/react-query";

import { MasterProductCodeFormValuesType } from "../types";
import { ConfirmResponseType } from "@/types";
import { useToast } from "@chakra-ui/react";

export type ConfirmMasterProductCodeType = {
    data: MasterProductCodeFormValuesType;
    id?: string
};

export const confirmMasterProductCode = async ({
    data,
    id = undefined,
}: ConfirmMasterProductCodeType): Promise<ConfirmResponseType> => {
    const response = id
        ? await axios.post(`master-product-codes/confirm/${id}`, data  )
        : await axios.post(`master-product-codes/confirm`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ConfirmResponseType,
        ConfirmMasterProductCodeType,
        {
            previousData: undefined;
        }
    >;
};

export const useConfirmMasterProductCode = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(confirmMasterProductCode, {
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
