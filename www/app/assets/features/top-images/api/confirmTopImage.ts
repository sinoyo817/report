import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType } from "@/lib/react-query";

import { TopImageFormValuesType } from "../types";
import { ConfirmResponseType } from "@/types";
import { useToast } from "@chakra-ui/react";

export type ConfirmTopImageType = {
    data: TopImageFormValuesType;
    id?: string
    locale?: string;
};

export const confirmTopImage = async ({
    data,
    id = undefined,
     locale,
}: ConfirmTopImageType): Promise<ConfirmResponseType> => {
    const response = id
        ? await axios.post(`top-images/confirm/${id}`, data  ,{
              params: locale ? { locale: locale } : {},
          })
        : await axios.post(`top-images/confirm`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ConfirmResponseType,
        ConfirmTopImageType,
        {
            previousData: undefined;
        }
    >;
};

export const useConfirmTopImage = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(confirmTopImage, {
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
