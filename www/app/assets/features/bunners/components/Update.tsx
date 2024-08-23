import React, { useEffect, useState } from "react";
import { useUpdateBunner } from "../api/updateBunner";

import { useConfirmBunner } from "../api/confirmBunner";
import { useNavigate } from "react-router-dom";

import { useBunner } from "../api/getBunner";
import { BunnerFormValuesType } from "../types";

import { useBunnerMeta } from "../api/getBunnerMeta";

import { useBoolean, useDisclosure } from "@chakra-ui/react";

import Form from "./Form";
import { bunnersModel } from "../api/schema";

import { SubmitHandler, useFormContext } from "react-hook-form";
import { ResponseValidationType } from "@/types";
import { AxiosError } from "axios";

import { FormWithConfirm } from "@/components/Form/FormWithConfirm";

import { useContentsKey } from "@/features/misc/hooks/useContentsKey";
import { adminPrefix  , defaultLocale } from "@/config";

import { useFormBeforeUnload } from "@/features/misc/hooks/useFormBeforeUnload";
import { LocaleFormTab } from "@/components/elements/Misc/LocaleFormTab";


type CrudProps = {
    id: string;
    locale?: string;
};

const Update = ({ id  , locale  }: CrudProps) => {
    const mutation = useUpdateBunner();

    const confirmMutation =  useConfirmBunner();

    const { setError, reset } = useFormContext();

    const [isValid, setValid] = useBoolean();
    const [isConfirm, setConfirm] = useBoolean();

    const navigate = useNavigate();
    const contentsKey = useContentsKey();

    const query = useBunner({ id , locale   });

   useFormBeforeUnload();

    const { data: meta } = useBunnerMeta();

    useEffect(() => {
        if (query.isFetched && query.data) {
            const { status, ...data } = query.data;
            reset(data);
        }
    }, [query.isFetched, query.data, reset]);

    const onSubmit: SubmitHandler<BunnerFormValuesType> = async (values) => {

        if (isValid && isConfirm) {
              const data = await mutation.mutateAsync({
                data: values,
                id: id,
                locale: locale,
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
                    }
                }
            }
        }
    };

    return (
        <>
            <LocaleFormTab id={id} locale={locale} />

            <FormWithConfirm<BunnerFormValuesType>
                onSubmit={onSubmit}
                isLoading={mutation.isLoading}
                isEdit={true}
                isConfirm={isConfirm}
                setConfirm={setConfirm}
                isConfirmLoading={confirmMutation.isLoading}
            >
                <Form model={bunnersModel} isConfirm={isConfirm}  isEdit={true}   locale={ locale && locale !== defaultLocale ? locale : undefined}   />
            </FormWithConfirm>
        </>
    );
};

export default Update;
