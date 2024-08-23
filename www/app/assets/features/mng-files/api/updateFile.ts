import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { FileFormValuesType, FileType } from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateFileType = { data: FileFormValuesType; id: string };

export const updateFile = async ({
    data,
    id,
}: UpdateFileType): Promise<FileType> => {
    const response = await axios.post(`files/${id}`, data, {
        headers: { "X-Http-Method-Override": "PATCH" },
    });
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        FileType,
        UpdateFileType,
        {
            previousData: FileType | undefined;
        }
    >;
};

export const useUpdateFile = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateFile, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["files"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<FileType>([
                "files",
                updateData.id,
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["files", updateData.id], {
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
                    ["files", context.previousData.id],
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
            queryClient.invalidateQueries(["files"]);
        },
        ...config,
    });
};
