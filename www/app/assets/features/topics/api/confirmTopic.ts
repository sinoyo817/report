import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfigType } from "@/lib/react-query";

import { TopicFormValuesType, TopicType } from "../types";
import { ConfirmResponseType, ResponseValidationType } from "@/types";
import { useToast } from "@chakra-ui/react";

export type confirmTopicType = {
    data: TopicFormValuesType;
    id?: string;
    locale?: string;
};

export const confirmTopic = async ({
    data,
    id = undefined,
    locale,
}: confirmTopicType): Promise<ConfirmResponseType> => {
    const response = id
        ? await axios.post(`topics/confirm/${id}`, data, {
              params: locale ? { locale: locale } : {},
          })
        : await axios.post(`topics/confirm`, data);
    return response.data;
};

type useOptions = {
    config?: MutationConfigType<
        ConfirmResponseType,
        confirmTopicType,
        {
            previousData: undefined;
        }
    >;
};

export const useConfirmTopic = ({ config }: useOptions = {}) => {
    const toast = useToast();
    return useMutation(confirmTopic, {
        onError: (error, valiables, context) => {
            toast({
                position: "top",
                title: `確認に失敗しました`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
        ...config,
    });
};
