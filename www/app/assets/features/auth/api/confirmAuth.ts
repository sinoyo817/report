import { axios } from "@/lib/axios";
import { MutationConfigType } from "@/lib/react-query";
import { ConfirmResponseType } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { AuthFormValueType } from "../types";

export type UpdateAuthType = { data: AuthFormValueType };

export const confirmAuth = async ({
    data,
}: UpdateAuthType): Promise<ConfirmResponseType> => {
    const response = await axios.post(`admins/auth-edit-confirm`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ConfirmResponseType,
        UpdateAuthType,
        {
            previousData: undefined;
        }
    >;
};

export const useConfirmAuth = ({ config }: useOptions = {}) => {
    return useMutation(confirmAuth, {
        ...config,
    });
};
