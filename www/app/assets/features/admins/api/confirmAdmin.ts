import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType } from "@/lib/react-query";

import { AdminFormValuesType, AdminType } from "../types";
import { ConfirmResponseType, ResponseValidationType } from "@/types";
import { useToast } from "@chakra-ui/react";

export type ConfirmAdminType = { data: AdminFormValuesType; id?: string };

export const confirmAdmin = async ({
    data,
    id = undefined,
}: ConfirmAdminType): Promise<ConfirmResponseType> => {
    const response = id
        ? await axios.post(`admins/confirm/${id}`, data)
        : await axios.post(`admins/confirm`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ConfirmResponseType,
        ConfirmAdminType,
        {
            previousData: undefined;
        }
    >;
};

export const useConfirmAdmin = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(confirmAdmin, {
        onError: (error, valiables, context) => {
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
