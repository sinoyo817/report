import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { SettingsOptionType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getSettingOption = async (): Promise<SettingsOptionType> => {
    const response = await axios.get(`settings/option-view`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<SettingsOptionType>;
};

export const useSettingOption = ({ options }: useOptions) => {
    return useQuery(["mng-setting-option"], () => getSettingOption(), options);
};
