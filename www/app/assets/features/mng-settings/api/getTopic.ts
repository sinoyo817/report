import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { SettingsTopicType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getSettingTopic = async (): Promise<SettingsTopicType> => {
    const response = await axios.get(`settings/topics-view`);
    return response.data;
};

type useOptions = {
    options?: QueryConfigType<SettingsTopicType>;
};

export const useSettingTopic = ({ options }: useOptions) => {
    return useQuery(["mng-setting-topic"], () => getSettingTopic(), options);
};
