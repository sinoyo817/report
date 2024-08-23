import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { SettingsContactType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getSettingContact = async (): Promise<SettingsContactType> => {
    const response = await axios.get(`settings/contacts-view`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<SettingsContactType>;
};

export const useSettingContact = ({ options }: useOptions) => {
    return useQuery(
        ["mng-setting-contact"],
        () => getSettingContact(),
        options
    );
};
