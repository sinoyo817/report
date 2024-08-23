import React, { useEffect } from "react";
import { AuthFormValueType } from "../types";
import { authFields, authModel } from "../api/shema";
import { FormWithConfirm } from "@/components/Form/FormWithConfirm";
import { useUpdateAuth } from "../api/updateAuth";
import { useConfirmAuth } from "../api/confirmAuth";
import { SubmitHandler, useFormContext, useFormState } from "react-hook-form";
import { useBoolean } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { ResponseValidationType } from "@/types";
import { useEditAuth } from "../api/getAuth";
import { GenerateFields } from "@/components/Form/GenerateFields";

const Update = () => {
    const mutation = useUpdateAuth();

    const confirmMutation = useConfirmAuth();

    const { setError, reset } = useFormContext();

    const query = useEditAuth();

    const [isValid, setValid] = useBoolean();
    const [isConfirm, setConfirm] = useBoolean();

    useEffect(() => {
        if (query.isFetched && query.data) {
            const resetData = {
                ...query.data,
                password_new: "",
                password_new_confirm: "",
            };
            reset(resetData);
        }
    }, [query.isFetched, query.data, reset]);

    const onSubmit: SubmitHandler<AuthFormValueType> = async (values, e) => {
        if (isValid && isConfirm) {
            const data = await mutation.mutateAsync({
                data: values,
            });
            setValid.off();
            setConfirm.off();
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
                        // console.log(errorMessages);
                    }
                }
            }
        }
    };

    const elements = GenerateFields({
        model: authModel,
        fields: authFields,
        isConfirm: isConfirm,
    });

    return (
        <FormWithConfirm<AuthFormValueType>
            onSubmit={onSubmit}
            isLoading={mutation.isLoading}
            isConfirmLoading={confirmMutation.isLoading}
            isEdit={true}
            isConfirm={isConfirm}
            setConfirm={setConfirm}
            isBack={false}
        >
            {elements}
        </FormWithConfirm>
    );
};

export default Update;
