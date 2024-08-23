import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import {
    MasterAreaFormValuesType,
    MasterAreaListType,
    MasterAreaType,
} from "../types";
import { useToast } from "@chakra-ui/react";

export type CreateMasterAreaType = { data: MasterAreaFormValuesType };

export const createMasterArea = async ({
    data,
}: CreateMasterAreaType): Promise<MasterAreaType> => {
    const response = await axios.post(`master-areas`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        MasterAreaType,
        CreateMasterAreaType,
        {
            previousData: MasterAreaListType | undefined;
        }
    >;
};

export const useCreateMasterArea = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(createMasterArea, {
        onMutate: async (newData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["master-areas"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<MasterAreaListType>([
                "master-areas",
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["master-areas"], {
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
                    ["master-areas"],
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
            queryClient.invalidateQueries(["master-areas"]);
        },
        ...config,
    });
};
