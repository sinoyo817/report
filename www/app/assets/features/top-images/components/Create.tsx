import React from "react";
import { useCreateTopImage } from "../api/createTopImage";

import { useConfirmTopImage } from "../api/confirmTopImage";
import { useNavigate } from "react-router-dom";

import { TopImageFormValuesType } from "../types";

import { useTopImageMeta } from "../api/getTopImageMeta";

import { useBoolean, useDisclosure } from "@chakra-ui/react";

import Form from "./Form";
import { topImagesModel } from "../api/schema";

import { SubmitHandler, useFormContext } from "react-hook-form";
import { useState } from "react";
import { ResponseValidationType } from "@/types";
import { AxiosError } from "axios";

import { FormWithConfirm } from "@/components/Form/FormWithConfirm";

import { useContentsKey } from "@/features/misc/hooks/useContentsKey";
import { adminPrefix } from "@/config";

const Create = () => {
    const mutation = useCreateTopImage();
    const confirmMutation =  useConfirmTopImage();

    const {
        setError,
        setValue,
        formState: { isDirty },
    } = useFormContext();

    const [html, setHtml] = useState("");

    const [isValid, setValid] = useBoolean();
    const [isConfirm, setConfirm] = useBoolean();

    const modalAction = useDisclosure();

    const navigate = useNavigate();
    const contentsKey = useContentsKey();

    const { data: meta } = useTopImageMeta();

    const onSubmit: SubmitHandler<TopImageFormValuesType> = async (values) => {
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
         <FormWithConfirm<TopImageFormValuesType>
            onSubmit={onSubmit}
            isLoading={mutation.isLoading}
            isEdit={false}
            isConfirm={isConfirm}
            setConfirm={setConfirm}
            isConfirmLoading={confirmMutation.isLoading}
        >
            <Form model={topImagesModel} isConfirm={isConfirm} />
        </FormWithConfirm>
    );
};

export default Create;
