import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { SettingsEventType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getSettingEvent = async (): Promise<SettingsEventType> => {
    const response = await axios.get(`settings/events-view`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<SettingsEventType>;
};

export const useSettingEvent = ({ options }: useOptions) => {
    return useQuery(["mng-setting-event"], () => getSettingEvent(), options);
};
