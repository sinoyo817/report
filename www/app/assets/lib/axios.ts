import { adminPrefix } from "@/config";
import Axios from "axios";

export const axios = Axios.create({ baseURL: `${adminPrefix}api/` });
axios.interceptors.request.use(
    (config) => {
        const csrfTokenMeta = document.querySelector('meta[name="csrfToken"]');
        if (csrfTokenMeta) {
            const csrfToken = (csrfTokenMeta as HTMLMetaElement).content;
            config.headers = {
                ...config.headers,
                "X-CSRF-TOKEN": csrfToken,
            };
        }

        config.headers = {
            ...config.headers,
            "X-Requested-With": "XMLHttpRequest",
            Accept: "application/json",
        };

        return config;
    },
    (error) => Promise.reject(error)
);

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (
            error.response.status === 401 &&
            location.pathname.indexOf("/login") === -1
        ) {
            location.reload();
        }

        if (error.response.status === 403) {
            location.replace(adminPrefix);
        }

        return Promise.reject(error);
    }
);

axios.defaults.withCredentials = true;
