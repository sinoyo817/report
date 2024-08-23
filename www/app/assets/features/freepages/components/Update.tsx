import React, { useEffect, useState } from "react";
import { useUpdateFreepageDocument } from "../api/updateFreepageDocument";

import { useConfirmFreepageDocument } from "../api/confirmFreepageDocument";
import { useNavigate } from "react-router-dom";

import { useFreepageDocument } from "../api/getFreepageDocument";
import { FreepageDocumentFormValuesType } from "../types";

import { useFreepageDocumentMeta } from "../api/getFreepageDocumentMeta";

import { useBoolean, useDisclosure } from "@chakra-ui/react";

import Form from "./Form";
import { freepageDocumentsModel, freepagesModel } from "../api/schema";

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
    const mutation = useUpdateFreepageDocument();

    const confirmMutation = useConfirmFreepageDocument();

    const { setError, reset, resetField, setValue } = useFormContext();

    const [html, setHtml] = useState("");

    const [isValid, setValid] = useBoolean();
    const [isConfirm, setConfirm] = useBoolean();

    const modalAction = useDisclosure();

    const navigate = useNavigate();
    const contentsKey = useContentsKey();

    const query = useFreepageDocument({ id });

    const { data: meta } = useFreepageDocumentMeta();

    useEffect(() => {
        if (query.isFetched && query.data) {
            const { status, ...data } = query.data;
            reset(data);
            resetField("freepage_directories");
            const freepageDirectories = query.data.freepage_directories;
            if (freepageDirectories && freepageDirectories.length > 0) {
                const formatData = freepageDirectories.map(
                    (item) => item.parent_id
                );
                setValue("freepage_directories", formatData);
            }
        }
    }, [query.isFetched, query.data, reset]);

    const onSubmit: SubmitHandler<FreepageDocumentFormValuesType> = async (
        values
    ) => {
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
        <FormWithPublicViewConfirm<FreepageDocumentFormValuesType>
            onSubmit={onSubmit}
            isLoading={mutation.isLoading}
            isEdit={true}
            isConfirm={isConfirm}
            setConfirm={setConfirm}
            setValid={setValid}
            modalAction={modalAction}
            html={html}
            isBack={true}
            isAccessibility={meta?.settings.accesibility === "on"}
        >
            <Form
                model={freepageDocumentsModel}
                isConfirm={isConfirm}
                isEdit={true}
            />
        </FormWithPublicViewConfirm>
    );
};

export default Update;
