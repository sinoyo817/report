import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import {
    MasterContactCategoryFormValuesType,
    MasterContactCategoryListType,
    MasterContactCategoryType,
} from "../types";
import { useToast } from "@chakra-ui/react";

export type CreateMasterContactCategoryType = {
    data: MasterContactCategoryFormValuesType;
};

export const createMasterContactCategory = async ({
    data,
}: CreateMasterContactCategoryType): Promise<MasterContactCategoryType> => {
    const response = await axios.post(`master-contact-categories`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        MasterContactCategoryType,
        CreateMasterContactCategoryType,
        {
            previousData: MasterContactCategoryListType | undefined;
        }
    >;
};

export const useCreateMasterContactCategory = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(createMasterContactCategory, {
        onMutate: async (newData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["master-contact-categories"]);

            // Snapshot the previous value
            const previousData =
                queryClient.getQueryData<MasterContactCategoryListType>([
                    "master-contact-categories",
                ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["master-contact-categories"], {
                    data: [...(previousData.data || []), newData.data],
                    collection: previousData.collection,
                });
            }

            // Return a context object with the snapshotted value
            return { previousData };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(
                    ["master-contact-categories"],
                    context.previousData
                );
            }
            toast({
                position: "top",
                title: `登録に失敗しました`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
        onSuccess(data, variables, context) {
            toast({
                position: "top",
                title: `登録に成功しました`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries(["master-contact-categories"]);
        },
        ...config,
    });
};
