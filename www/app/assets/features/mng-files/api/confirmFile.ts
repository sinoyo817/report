import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType } from "@/lib/react-query";

import { FileFormValuesType } from "../types";
import { ConfirmResponseType } from "@/types";
import { useToast } from "@chakra-ui/react";

export type ConfirmFileType = { data: FileFormValuesType; id?: string };

export const confirmFile = async ({
    data,
    id = undefined,
}: ConfirmFileType): Promise<ConfirmResponseType> => {
    const response = id
        ? await axios.post(`files/confirm/${id}`, data)
        : await axios.post(`files/confirm`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ConfirmResponseType,
        ConfirmFileType,
        {
            previousData: undefined;
        }
    >;
};

export const useConfirmFile = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(confirmFile, {
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
