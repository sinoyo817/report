import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType } from "@/lib/react-query";

import { AssetFormValuesType } from "../types";
import { ConfirmResponseType } from "@/types";
import { useToast } from "@chakra-ui/react";

export type ConfirmAssetType = { data: AssetFormValuesType; id?: string };

export const confirmAsset = async ({
    data,
    id = undefined,
}: ConfirmAssetType): Promise<ConfirmResponseType> => {
    const response = id
        ? await axios.post(`assets/confirm/${id}`, data)
        : await axios.post(`assets/confirm`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ConfirmResponseType,
        ConfirmAssetType,
        {
            previousData: undefined;
        }
    >;
};

export const useConfirmAsset = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(confirmAsset, {
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
