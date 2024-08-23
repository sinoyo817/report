import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType } from "@/lib/react-query";

import { ResetReturnType } from "../types";
import { useToast } from "@chakra-ui/react";

export type CreateResetType = {};

export const postReset = async (): Promise<ResetReturnType> => {
    const response = await axios.post(`resets/reset`);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<ResetReturnType>;
};

export const usePostReset = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(postReset, {
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error, variables, context) => {
            toast({
                position: "top",
                title: `リセットに失敗しました`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
        onSuccess(data, variables, context) {
            toast({
                position: "top",
                title: `リセットに成功しました`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        },
        ...config,
    });
};
