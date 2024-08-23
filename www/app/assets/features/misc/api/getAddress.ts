import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { QueryConfigType } from "@/lib/react-query";

export type GetAddressType = {
    id: number;
    postal_code: string;
    is_jigyosyo: number;
    is_general: number;
    prefecture: string;
    city: string;
    sublocality1: string;
    sublocality2: string;
    office_name: string;
    prefecture_kana: string;
    city_kana: string;
    sublocality1_kana: string;
    sublocality2_kana: string;
    office_name_kana: string;
    created: string;
    modified: string;
};

export type ReponseGetAddressType = {
    postalCodes: GetAddressType[];
};

export const getAddress = async ({
    postalCode,
}: {
    postalCode: string;
}): Promise<ReponseGetAddressType> => {
    const response = await axios.get(`postalCodes/query`, {
        baseURL: "/postal-code/",
        params: {
            q: postalCode,
        },
    });
    return response.data;
};
