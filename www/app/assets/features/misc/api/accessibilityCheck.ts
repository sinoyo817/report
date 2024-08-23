import { axios } from "@/lib/axios";

import { AccessiblityResoponseType } from "@/config/accessibility";

export type CheckGifType = {
    data: {
        file_id: string;
    };
};
export type CheckLinkType = {
    data: {
        url: string;
    };
};

export const checkGif = async ({
    data,
}: CheckGifType): Promise<AccessiblityResoponseType> => {
    const response = await axios.post(`accessibilities/gif`, data);
    return response.data;
};

export const checkLink = async ({
    data,
}: CheckLinkType): Promise<AccessiblityResoponseType> => {
    const response = await axios.post(`accessibilities/link`, data);
    return response.data;
};
