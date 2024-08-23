import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { MasterTopicCategoryType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getMasterTopicCategory = async ({
    id,
}: {
    id: string;
}): Promise<MasterTopicCategoryType> => {
    const response = await axios.get(`master-topic-categories/${id}`);
    return response.data;
};

type useOptions = {
    id: string;
    options?: QueryConfigType<MasterTopicCategoryType>;
};

export const useMasterTopicCategory = ({ id, options }: useOptions) => {
    return useQuery(
        ["master-topic-categories", id],
        () => getMasterTopicCategory({ id }),
        options
    );
};
