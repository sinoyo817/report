import React, { useEffect } from "react";
import { AuthPasswordFormValueType } from "../types";
import { authPasswordFields, authModel } from "../api/shema";
import { FormWithConfirm } from "@/components/Form/FormWithConfirm";
import { useConfirmAuth } from "../api/confirmAuth";
import { SubmitHandler, useFormContext, useFormState } from "react-hook-form";
import { useBoolean } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { ResponseValidationType } from "@/types";
import { useEditAuth } from "../api/getAuth";
import { useUpdatePasswordAuth } from "../api/updatePasswordAuth";
import { FormWithoutConfirm } from "@/components/Form/FormWithoutConfirm";
import { GenerateFields } from "@/components/Form/GenerateFields";

const Update = () => {
    const mutation = useUpdatePasswordAuth();

    const { setError } = useFormContext();

    const onSubmit: SubmitHandler<AuthPasswordFormValueType> = async (
        values,
        e
    ) => {
        try {
            const data = await mutation.mutateAsync({
                data: values,
            });
        } catch (e) {
            if (e instanceof AxiosError) {
                if (e.response?.status === 422) {
                    const errorMessages: ResponseValidationType =
                        e.response.data.error;

                    for (const [key, value] of Object.entries(errorMessages)) {
                        setError(key, { types: value });
                    }
                    // console.log(errorMessages);
                }
            }
        }
    };

    const elements = GenerateFields({
        model: authModel,
        fields: authPasswordFields,
    });

    return (
        <FormWithoutConfirm<AuthPasswordFormValueType>
            onSubmit={onSubmit}
            isLoading={mutation.isLoading}
            isEdit={true}
            isBack={false}
        >
            {elements}
        </FormWithoutConfirm>
    );
};

export default Update;
