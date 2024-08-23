import React from "react";
import { useCreateEvent } from "../api/createEvent";

import { useConfirmEvent } from "../api/confirmEvent";
import { useNavigate } from "react-router-dom";

import { EventFormValuesType } from "../types";

import { useEventMeta } from "../api/getEventMeta";

import { useBoolean, useDisclosure } from "@chakra-ui/react";

import Form from "./Form";
import { eventsModel } from "../api/schema";

import { SubmitHandler, useFormContext } from "react-hook-form";
import { useState } from "react";
import { ResponseValidationType } from "@/types";
import { AxiosError } from "axios";

import { FormWithPublicViewConfirm } from "@/components/Form/FormWithPublicViewConfirm";

import { useContentsKey } from "@/features/misc/hooks/useContentsKey";
import { adminPrefix } from "@/config";

const Create = () => {
    const mutation = useCreateEvent();

    const confirmMutation = useConfirmEvent();

    const { setError } = useFormContext();

    const [html, setHtml] = useState("");

    const [isValid, setValid] = useBoolean();
    const [isConfirm, setConfirm] = useBoolean();

    const modalAction = useDisclosure();

    const navigate = useNavigate();
    const contentsKey = useContentsKey();

    const { data: meta } = useEventMeta();

    const onSubmit: SubmitHandler<EventFormValuesType> = async (values) => {
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
                    }
                }
            }
        }
    };

    return (
        <FormWithPublicViewConfirm<EventFormValuesType>
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
            <Form model={eventsModel} isConfirm={isConfirm} />
        </FormWithPublicViewConfirm>
    );
};

export default Create;
