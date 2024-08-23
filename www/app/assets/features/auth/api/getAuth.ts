import { axios } from "@/lib/axios";
import { QueryConfigType } from "@/lib/react-query";
import { useQuery } from "@tanstack/react-query";

import { AuthFormValueType } from "../types";

const getEditAuth = async (): Promise<AuthFormValueType> => {
    const response = await axios.get(`admins/auth`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<AuthFormValueType>;
};

export const useEditAuth = ({ options }: useOptions = {}) => {
    return useQuery(["auth"], () => getEditAuth(), options);
};
