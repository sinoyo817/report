import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType, queryClient } from "@/lib/react-query";

import { ApprovalsAccessType } from "../types";
import { useToast } from "@chakra-ui/react";

export type UpdateApprovalAccessType = { data: ApprovalsAccessType };

export const updateApprovalAccess = async ({
    data,
}: UpdateApprovalAccessType): Promise<ApprovalsAccessType> => {
    const response = await axios.post(`approvals/access-update`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ApprovalsAccessType,
        UpdateApprovalAccessType,
        {
            previousData: ApprovalsAccessType | undefined;
        }
    >;
};

export const useUpdateApprovalAccess = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(updateApprovalAccess, {
        onMutate: async (updateData) => {
            // When mutate is called:
            await queryClient.cancelQueries(["mng-approval-access"]);

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<ApprovalsAccessType>([
                "mng-approval-access",
            ]);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(["mng-approval-access"], {
                    ...previousData,
                    ...updateData.data,
                });
            }

            // Return a context object with the snapshotted value
            return { previousData };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(
                    ["mng-approval-access"],
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
            queryClient.invalidateQueries(["mng-approval-access"]);
        },
        ...config,
    });
};
