import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { MasterGroupFormValuesType, MasterGroupListType, MasterGroupType } from "../types";
import { useToast } from "@chakra-ui/react";

export type CreateMasterGroupType = { data: MasterGroupFormValuesType };

export const createMasterGroup = async ({
    data,
}: CreateMasterGroupType): Promise<MasterGroupType> => {
    const response = await axios.post(`master-groups`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        MasterGroupType,
        CreateMasterGroupType,
        {
            previousData: MasterGroupListType | undefined;
        }
    >;
};

export const useCreateMasterGroup = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(createMasterGroup, {
        onMutate: async (newData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["master-groups"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<MasterGroupListType>([
                "master-groups",
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["master-groups"], {
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
                queryClient.setQueryData(["master-groups"], context.previousData);
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
            queryClient.invalidateQueries(["master-groups"]);
        },
        ...config,
    });
};
