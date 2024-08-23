import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType } from "@/lib/react-query";

import { FreepageDocumentFormValuesType } from "../types";
import { ConfirmResponseType } from "@/types";
import { useToast } from "@chakra-ui/react";

export type ConfirmFreepageDocumentType = {
    data: FreepageDocumentFormValuesType;
    id?: string;
};

export const confirmFreepageDocument = async ({
    data,
    id = undefined,
}: ConfirmFreepageDocumentType): Promise<ConfirmResponseType> => {
    const response = id
        ? await axios.post(`freepage-documents/confirm/${id}`, data)
        : await axios.post(`freepage-documents/confirm`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ConfirmResponseType,
        ConfirmFreepageDocumentType,
        {
            previousData: undefined;
        }
    >;
};

export const useConfirmFreepageDocument = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(confirmFreepageDocument, {
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
