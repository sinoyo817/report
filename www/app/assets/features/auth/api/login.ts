import { adminPrefix } from "@/config";
import { axios } from "@/lib/axios";
import { LoginRequestType, AuthType } from "../types";

export const loginAdsys = async (data: LoginRequestType): Promise<AuthType> => {
    const search = location.search;
    const query = new URLSearchParams(search);
    const response = await axios.post(`${adminPrefix}admins/login`, data, {
        baseURL: "",
        params: {
            redirect: query.get("redirect"),
        },
    });
    return response.data;
};
