import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { SettingsGeneralType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getSettingGeneral = async (): Promise<SettingsGeneralType> => {
    const response = await axios.get(`settings/general-view`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<SettingsGeneralType>;
};

export const useSettingGeneral = ({ options }: useOptions) => {
    return useQuery(
        ["mng-setting-general"],
        () => getSettingGeneral(),
        options
    );
};
