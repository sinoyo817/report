import React, { useEffect, useState } from "react";
import { useUpdateEvent } from "../api/updateEvent";

import { useConfirmEvent } from "../api/confirmEvent";
import { useNavigate } from "react-router-dom";

import { useEvent } from "../api/getEvent";
import { EventFormValuesType } from "../types";

import { useEventMeta } from "../api/getEventMeta";

import { useBoolean, useDisclosure } from "@chakra-ui/react";

import Form from "./Form";
import { eventsModel } from "../api/schema";

import { SubmitHandler, useFormContext } from "react-hook-form";
import { ResponseValidationType } from "@/types";
import { AxiosError } from "axios";

import { FormWithPublicViewConfirm } from "@/components/Form/FormWithPublicViewConfirm";

import { useContentsKey } from "@/features/misc/hooks/useContentsKey";
import { adminPrefix } from "@/config";

type CrudProps = {
    id: string;
};

const Update = ({ id }: CrudProps) => {
    const mutation = useUpdateEvent();

    const confirmMutation = useConfirmEvent();

    const { setError, reset, resetField, setValue } = useFormContext();

    const [html, setHtml] = useState("");

    const [isValid, setValid] = useBoolean();
    const [isConfirm, setConfirm] = useBoolean();

    const modalAction = useDisclosure();

    const navigate = useNavigate();
    const contentsKey = useContentsKey();

    const query = useEvent({ id });

    const { data: meta } = useEventMeta();

    useEffect(() => {
        if (query.isFetched && query.data) {
            const { status, ...data } = query.data;
            reset(data);

            resetField("master_event_categories");
            const masterEventGenres = query.data.master_event_categories;
            if (masterEventGenres && masterEventGenres.length > 0) {
                const formatData = masterEventGenres.map((item) => item.id);
                setValue("master_event_categories", formatData);
            }
            resetField("master_areas");
            const masterAreas = query.data.master_areas;
            if (masterAreas && masterAreas.length > 0) {
                const formatData = masterAreas.map((item) => item.id);
                setValue("master_areas", formatData);
            }
        }
    }, [query.isFetched, query.data, reset]);

    const onSubmit: SubmitHandler<EventFormValuesType> = async (values) => {
        if (isValid && isConfirm) {
            const data = await mutation.mutateAsync({ data: values, id: id });

            navigate(`${adminPrefix}${contentsKey}`);
        } else {
            try {
                const data = await confirmMutation.mutateAsync({
                    data: values,
                    id: id,
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
            isEdit={true}
            isConfirm={isConfirm}
            setConfirm={setConfirm}
            setValid={setValid}
            modalAction={modalAction}
            html={html}
            isAccessibility={meta?.settings.accesibility === "on"}
        >
            <Form
                model={eventsModel}
                isConfirm={isConfirm}
                isEdit={true}
                data={query.data}
            />
        </FormWithPublicViewConfirm>
    );
};

export default Update;
