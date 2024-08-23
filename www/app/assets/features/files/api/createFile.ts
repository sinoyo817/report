import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { FileFormValuesType, FileListType, FileType } from "../types";
import { useToast } from "@chakra-ui/react";

export type CreateFileType = { data: FileFormValuesType };

export const createFile = async ({
    data,
}: CreateFileType): Promise<FileType> => {
    const response = await axios.post(`files/upload`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        FileType,
        CreateFileType,
        {
            previousData: FileListType | undefined;
        }
    >;
};

export const useCreateFile = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(createFile, {
        onMutate: async (newData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["files"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<FileListType>([
                "files",
            ]);

            // Optimistically update to the new value
            // if (previousData) {
            //     queryClient.setQueryData(["files"], {
            //         data: [...(previousData.data || []), newData.data],
            //         collection: previousData.collection,
            //     });
            // }

            // Return a context object with the snapshotted value
            return { previousData };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error, valiables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["files"], context.previousData);
            }
            toast({
                position: "top",
                title: `登録に失敗しました`,
                status: "error",
                duration: 1000,
                isClosable: true,
            });
        },
        onSuccess(data, variables, context) {
            //
            toast({
                position: "top",
                title: `登録に成功しました`,
                status: "success",
                duration: 1000,
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
