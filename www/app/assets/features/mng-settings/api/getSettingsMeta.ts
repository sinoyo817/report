import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { QueryConfigType } from "@/lib/react-query";
import { SettingMetaType } from "../types";

const getSettingsMeta = async (): Promise<SettingMetaType> => {
    const response = await axios.get(`settings/metadata`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<SettingMetaType>;
};

export const useSettingMeta = ({ options }: useOptions = {}) => {
    return useQuery(["mng-settings-meta"], () => getSettingsMeta(), options);
};
