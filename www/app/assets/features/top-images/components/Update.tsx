import React, { useEffect, useState } from "react";
import { useUpdateTopImage } from "../api/updateTopImage";

import { useConfirmTopImage } from "../api/confirmTopImage";
import { useNavigate } from "react-router-dom";

import { useTopImage } from "../api/getTopImage";
import { TopImageFormValuesType } from "../types";

import { useTopImageMeta } from "../api/getTopImageMeta";

import { useBoolean, useDisclosure } from "@chakra-ui/react";

import Form from "./Form";
import { topImagesModel } from "../api/schema";

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
    const mutation = useUpdateTopImage();

    const confirmMutation =  useConfirmTopImage();

    const { setError, reset } = useFormContext();

    const [isValid, setValid] = useBoolean();
    const [isConfirm, setConfirm] = useBoolean();

    const navigate = useNavigate();
    const contentsKey = useContentsKey();

    const query = useTopImage({ id , locale   });

   useFormBeforeUnload();

    const { data: meta } = useTopImageMeta();

    useEffect(() => {
        if (query.isFetched && query.data) {
            const { status, ...data } = query.data;
            reset(data);
        }
    }, [query.isFetched, query.data, reset]);

    const onSubmit: SubmitHandler<TopImageFormValuesType> = async (values) => {

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

         <FormWithConfirm<TopImageFormValuesType>
            onSubmit={onSubmit}
            isLoading={mutation.isLoading}
            isEdit={true}
            isConfirm={isConfirm}
            setConfirm={setConfirm}
            isConfirmLoading={confirmMutation.isLoading}
        >
            <Form model={topImagesModel} isConfirm={isConfirm}  isEdit={true}   locale={ locale && locale !== defaultLocale ? locale : undefined}   />
        </FormWithConfirm>
        
        </>
    );
};

export default Update;
