import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { SettingsFreepageType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getSettingFreepage = async (): Promise<SettingsFreepageType> => {
    const response = await axios.get(`settings/freepages-view`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<SettingsFreepageType>;
};

export const useSettingFreepage = ({ options }: useOptions) => {
    return useQuery(
        ["mng-setting-freepage"],
        () => getSettingFreepage(),
        options
    );
};
