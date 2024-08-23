import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";
import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { AuthType, AuthPasswordFormValueType } from "../types";

export type UpdateAuthType = { data: AuthPasswordFormValueType };

export const updatePasswordAuth = async ({
    data,
}: UpdateAuthType): Promise<AuthType> => {
    const response = await axios.post(`admins/auth-password-edit`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        AuthType,
        UpdateAuthType,
        {
            previousData: AuthType | undefined;
        }
    >;
};

export const useUpdatePasswordAuth = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updatePasswordAuth, {
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error, valiables, context) => {
            toast({
                position: "top",
                title: `更新に失敗しました`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
        onSuccess(data, variables, context) {
            //
            toast({
                position: "top",
                title: `更新に成功しました`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries(["auth-user"]);
        },
        ...config,
    });
};
