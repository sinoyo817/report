import { adminPrefix } from "@/config";
import { axios } from "@/lib/axios";

import { AuthType } from "../types";

export const getUser = async (): Promise<AuthType> => {
    const response = await axios.get(`${adminPrefix}admins/me`, {
        baseURL: "",
    });
    return response.data;
};
