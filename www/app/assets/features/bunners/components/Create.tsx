import React from "react";
import { useCreateBunner } from "../api/createBunner";

import { useConfirmBunner } from "../api/confirmBunner";
import { useNavigate } from "react-router-dom";

import { BunnerFormValuesType } from "../types";

import { useBunnerMeta } from "../api/getBunnerMeta";

import { useBoolean, useDisclosure } from "@chakra-ui/react";

import Form from "./Form";
import { bunnersModel } from "../api/schema";

import { SubmitHandler, useFormContext } from "react-hook-form";
import { useState } from "react";
import { ResponseValidationType } from "@/types";
import { AxiosError } from "axios";

import { FormWithConfirm } from "@/components/Form/FormWithConfirm";

import { useContentsKey } from "@/features/misc/hooks/useContentsKey";
import { adminPrefix } from "@/config";

const Create = () => {
    const mutation = useCreateBunner();

    const confirmMutation =  useConfirmBunner();

    const { setError } = useFormContext();

    const [isValid, setValid] = useBoolean();
    const [isConfirm, setConfirm] = useBoolean();

    const navigate = useNavigate();
    const contentsKey = useContentsKey();

    const { data: meta } = useBunnerMeta();

    const onSubmit: SubmitHandler<BunnerFormValuesType> = async (values) => {

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
         <FormWithConfirm<BunnerFormValuesType>
            onSubmit={onSubmit}
            isLoading={mutation.isLoading}
            isEdit={false}
            isConfirm={isConfirm}
            setConfirm={setConfirm}
            isConfirmLoading={confirmMutation.isLoading}
        >
            <Form model={bunnersModel} isConfirm={isConfirm} />
        </FormWithConfirm>
    );
};

export default Create;
