import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { TopImageFormValuesType, TopImageType } from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateTopImageType = {
    data: TopImageFormValuesType;
    id: string;
     locale?: string;
};

export const updateTopImage = async ({
    data,
    id,
     locale,
}: UpdateTopImageType): Promise<TopImageType> => {
    const response = await axios.post(`top-images/${id}`, data, {
        headers: { "X-Http-Method-Override": "PATCH" },
         params: locale ? { locale: locale } : {},
    });
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        TopImageType,
        UpdateTopImageType,
        {
            previousData: TopImageType | undefined;
        }
    >;
};

export const useUpdateTopImage = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateTopImage, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["top-images"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<TopImageType>([
                "top-images",
                updateData.id,
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["top-images", updateData.id], {
                    ...previousData,
                    ...updateData.data,
                    id: updateData.id,
                });
            }

            // Return a context object with the snapshotted value
            return { previousData };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(
                    ["top-images", context.previousData.id],
                    context.previousData
                );
            }
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
            queryClient.invalidateQueries(["top-images"]);
        },
        ...config,
    });
};
