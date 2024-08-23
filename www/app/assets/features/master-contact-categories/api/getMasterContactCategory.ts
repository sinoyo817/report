import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";

import { MasterContactCategoryType } from "../types";
import { QueryConfigType } from "@/lib/react-query";

const getMasterContactCategory = async ({
    id,
}: {
    id: string;
}): Promise<MasterContactCategoryType> => {
    const response = await axios.get(`master-contact-categories/${id}`);
    return response.data;
};

type useOptions = {
    id: string;
    options?: QueryConfigType<MasterContactCategoryType>;
};

export const useMasterContactCategory = ({ id, options }: useOptions) => {
    return useQuery(
        ["master-contact-categories", id],
        () => getMasterContactCategory({ id }),
        options
    );
};
