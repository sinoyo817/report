import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType } from "@/lib/react-query";

import { MasterAreaFormValuesType } from "../types";
import { ConfirmResponseType } from "@/types";
import { useToast } from "@chakra-ui/react";

export type ConfirmMasterAreaType = {
    data: MasterAreaFormValuesType;
    id?: string;
};

export const confirmMasterArea = async ({
    data,
    id = undefined,
}: ConfirmMasterAreaType): Promise<ConfirmResponseType> => {
    const response = id
        ? await axios.post(`master-areas/confirm/${id}`, data)
        : await axios.post(`master-areas/confirm`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ConfirmResponseType,
        ConfirmMasterAreaType,
        {
            previousData: undefined;
        }
    >;
};

export const useConfirmMasterArea = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(confirmMasterArea, {
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
