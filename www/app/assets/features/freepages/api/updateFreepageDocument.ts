import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { FreepageDocumentFormValuesType, FreepageDocumentType } from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateFreepageDocumentType = {
    data: FreepageDocumentFormValuesType;
    id: string;
};

export const updateFreepageDocument = async ({
    data,
    id,
}: UpdateFreepageDocumentType): Promise<FreepageDocumentType> => {
    const response = await axios.post(`freepage-documents/${id}`, data, {
        headers: { "X-Http-Method-Override": "PATCH" },
    });
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        FreepageDocumentType,
        UpdateFreepageDocumentType,
        {
            previousData: FreepageDocumentType | undefined;
        }
    >;
};

export const useUpdateFreepageDocument = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateFreepageDocument, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["freepage-documents"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<FreepageDocumentType>(
                ["freepage-documents", updateData.id]
            );

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(
                    ["freepage-documents", updateData.id],
                    {
                        ...previousData,
                        ...updateData.data,
                        id: updateData.id,
                    }
                );
            }

            // Return a context object with the snapshotted value
            return { previousData };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(
                    ["freepage-documents", context.previousData.id],
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
            queryClient.invalidateQueries(["freepage-documents"]);
            queryClient.invalidateQueries(["freepage-all-directories"]);
            // queryClient.invalidateQueries(["freepage-documents-meta"]);
        },
        ...config,
    });
};
