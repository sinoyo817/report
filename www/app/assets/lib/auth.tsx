import { initReactQueryAuth } from "./react-query-auth";

import {
    loginAdsys,
    getUser,
    LoginRequestType,
    AuthType,
} from "@/features/auth";

const handleUserResponse = async (data: AuthType) => data;

const loadUser = async () => {
    const data = await getUser();
    return data;
};

const loginFn = async (data: LoginRequestType) => {
    const response = await loginAdsys(data);
    const user = await handleUserResponse(response);
    return user;
};

const registerFn = async () => null;

const logoutFn = async () => {
    window.location.reload();
};

const authConfig = {
    loadUser,
    loginFn,
    registerFn,
    logoutFn,
};

export const { AuthProvider, useAuth } = initReactQueryAuth<
    AuthType | null,
    Error,
    LoginRequestType,
    unknown
>(authConfig);
