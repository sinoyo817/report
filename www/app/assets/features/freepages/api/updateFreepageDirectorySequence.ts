import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import {
    FreepageDirectorySequenceFormValuesType,
    FreepageDirectoryType,
} from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateFreepageDirectorySequenceType = {
    data: FreepageDirectorySequenceFormValuesType;
    id: string;
};

export const updateFreepageDirectorySequence = async ({
    data,
    id,
}: UpdateFreepageDirectorySequenceType): Promise<FreepageDirectoryType> => {
    const response = await axios.post(
        `freepage-directories/sequence/${id}`,
        data
        // {
        //     headers: { "X-Http-Method-Override": "PATCH" },
        // }
    );
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        FreepageDirectoryType,
        UpdateFreepageDirectorySequenceType,
        {
            previousData: FreepageDirectoryType | undefined;
        }
    >;
};

export const useUpdateFreepageDirectorySequence = ({
    config,
}: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateFreepageDirectorySequence, {
        // onMutate: async (updateData) => {
        //     // When mutate is called:
        //     await queryClient.cancelQueries(["freepage-all-directories"]);

        //     // Snapshot the previous value
        //     const previousData =
        //         queryClient.getQueryData<FreepageDirectoryType>([
        //             "freepage-all-directories",
        //             updateData.id,
        //         ]);

        //     // Optimistically update to the new value
        //     if (previousData) {
        //         queryClient.setQueryData(
        //             ["freepage-all-directories", updateData.id],
        //             {
        //                 ...previousData,
        //                 ...updateData.data,
        //                 id: updateData.id,
        //             }
        //         );
        //     }

        //     // Return a context object with the snapshotted value
        //     return { previousData };
        // },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error, variables, context) => {
            // if (context?.previousData) {
            //     queryClient.setQueryData(
            //         ["freepage-all-directories", context.previousData.id],
            //         context.previousData
            //     );
            // }
            toast({
                position: "top",
                title: `更新に失敗しました`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
        onSuccess(data, variables, context) {
            //
            toast({
                position: "top",
                title: `更新に成功しました`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries(["freepage-all-directories"]);
            queryClient.invalidateQueries(["freepage-directories-meta"]);
        },
        ...config,
    });
};
