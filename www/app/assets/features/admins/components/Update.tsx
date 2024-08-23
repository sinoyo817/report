import React from "react";
import { useUpdateAdmin } from "../api/updateAdmin";
import { AdminFormValuesType } from "../types";

import { Skeleton, useBoolean } from "@chakra-ui/react";
import { adminsModel } from "../api/schema";
import { SubmitHandler, useFormContext } from "react-hook-form";
import { useAdmin } from "../api/getAdmin";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useConfirmAdmin } from "../api/confirmAdmin";
import { AxiosError } from "axios";
import { ResponseValidationType } from "@/types";
import { FormWithConfirm } from "@/components/Form/FormWithConfirm";
import Form from "./Form";
import { adminPrefix } from "@/config";
import { useContentsKey } from "@/features/misc/hooks/useContentsKey";

type CrudProps = {
    id: string;
};

const Update = ({ id }: CrudProps) => {
    const mutation = useUpdateAdmin();
    const confirmMutation = useConfirmAdmin();

    const { setError, reset, setValue } = useFormContext();

    const [isValid, setValid] = useBoolean();
    const [isConfirm, setConfirm] = useBoolean();

    const navigate = useNavigate();
    const contentsKey = useContentsKey();

    const query = useAdmin({ id });

    useEffect(() => {
        if (query.isFetched && query.data) {
            reset(query.data);
        }
    }, [query.isFetched, query.data, reset]);

    const onSubmit: SubmitHandler<AdminFormValuesType> = async (values, e) => {
        if (isValid && isConfirm) {
            const data = await mutation.mutateAsync({
                data: values,
                id: id,
            });

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
        <Skeleton isLoaded={!query.isLoading}>
            <FormWithConfirm<AdminFormValuesType>
                onSubmit={onSubmit}
                isLoading={mutation.isLoading}
                isEdit={true}
                isConfirm={isConfirm}
                setConfirm={setConfirm}
                isConfirmLoading={confirmMutation.isLoading}
            >
                <Form model={adminsModel} isConfirm={isConfirm} isEdit={true} />
            </FormWithConfirm>
        </Skeleton>
    );
};

export default Update;
