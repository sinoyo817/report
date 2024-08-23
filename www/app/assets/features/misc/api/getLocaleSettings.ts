import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { QueryConfigType } from "@/lib/react-query";
import { LocaleSettingType } from "@/types";

const getLocaleSetting = async (): Promise<LocaleSettingType> => {
    const response = await axios.get(`common-settings/locale-settings`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<LocaleSettingType>;
};

export const useLocaleSetting = ({ options }: useOptions = {}) => {
    return useQuery(["locale-setting"], () => getLocaleSetting(), options);
};
