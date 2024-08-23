import React, { useCallback, useEffect } from "react";
import { useCreateTopic } from "../api/createTopic";
import { TopicFormValuesType } from "../types";

import { useBoolean, useDisclosure } from "@chakra-ui/react";
import { topicsFields, topicsModel } from "../api/schema";
import { SubmitHandler, useFormContext } from "react-hook-form";
import { useState } from "react";
import {
    useNavigate,
    useNavigation,
    useNavigationType,
} from "react-router-dom";
import { useConfirmTopic } from "../api/confirmTopic";
import { ResponseValidationType } from "@/types";
import { AxiosError } from "axios";
import { FormWithPublicViewConfirm } from "@/components/Form/FormWithPublicViewConfirm";
import { useTopicMeta } from "../api/getTopicMeta";
import { useAuth } from "@/lib/auth";
import { useContentsKey } from "@/features/misc/hooks/useContentsKey";
import { adminPrefix } from "@/config";
import Form from "./Form";

const Create = () => {
    const mutation = useCreateTopic();
    const confirmMutation = useConfirmTopic();

    const {
        setError,
        setValue,
        formState: { isDirty },
    } = useFormContext();

    const user = useAuth();

    const [html, setHtml] = useState("");

    const { data: meta } = useTopicMeta();

    const [isValid, setValid] = useBoolean();
    const [isConfirm, setConfirm] = useBoolean();

    const modalAction = useDisclosure();

    const navigate = useNavigate();
    const contentsKey = useContentsKey();

    const onSubmit: SubmitHandler<TopicFormValuesType> = async (values) => {
        if (isValid && isConfirm) {
            const data = await mutation.mutateAsync({ data: values });

            navigate(`${adminPrefix}${contentsKey}`);
        } else {
            try {
                const data = await confirmMutation.mutateAsync({
                    data: values,
                });
                if (data.status) {
                    setValid.on();
                    setConfirm.on();
                    if (data.view) {
                        setHtml(data.view);
                        modalAction.onOpen();
                    }
                }
            } catch (e) {
                if (e instanceof AxiosError) {
                    if (e.response?.status === 422) {
                        const errorMessages: ResponseValidationType =
                            e.response.data.error;

                        for (const [key, value] of Object.entries(
                            errorMessages
                        )) {
                            setError(key, { types: value });
                        }
                        // console.log(errorMessages);
                    }
                }
            }
        }
    };

    return (
        <FormWithPublicViewConfirm<TopicFormValuesType>
            onSubmit={onSubmit}
            isLoading={mutation.isLoading}
            isEdit={false}
            isConfirm={isConfirm}
            setConfirm={setConfirm}
            setValid={setValid}
            modalAction={modalAction}
            html={html}
            isAccessibility={meta?.settings.accesibility === "on"}
        >
            <Form model={topicsModel} isConfirm={isConfirm} />
        </FormWithPublicViewConfirm>
    );
};

export default Create;
