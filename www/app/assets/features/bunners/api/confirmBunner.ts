import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType } from "@/lib/react-query";

import { BunnerFormValuesType } from "../types";
import { ConfirmResponseType } from "@/types";
import { useToast } from "@chakra-ui/react";

export type ConfirmBunnerType = {
    data: BunnerFormValuesType;
    id?: string
    locale?: string;
};

export const confirmBunner = async ({
    data,
    id = undefined,
     locale,
}: ConfirmBunnerType): Promise<ConfirmResponseType> => {
    const response = id
        ? await axios.post(`bunners/confirm/${id}`, data  ,{
              params: locale ? { locale: locale } : {},
          })
        : await axios.post(`bunners/confirm`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ConfirmResponseType,
        ConfirmBunnerType,
        {
            previousData: undefined;
        }
    >;
};

export const useConfirmBunner = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(confirmBunner, {
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
