import React from "react";
import { useUpdateTopic } from "../api/updateTopic";
import { TopicFormValuesType } from "../types";

import { useBoolean, useDisclosure } from "@chakra-ui/react";
import { topicsModel } from "../api/schema";
import { SubmitHandler, useFormContext } from "react-hook-form";
import { useTopic } from "../api/getTopic";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConfirmTopic } from "../api/confirmTopic";
import { AxiosError } from "axios";
import { ResponseValidationType } from "@/types";
import { FormWithPublicViewConfirm } from "@/components/Form/FormWithPublicViewConfirm";
import { useTopicMeta } from "../api/getTopicMeta";
import { adminPrefix, defaultLocale } from "@/config";
import { useContentsKey } from "@/features/misc/hooks/useContentsKey";
import Form from "./Form";
import { useFormBeforeUnload } from "@/features/misc/hooks/useFormBeforeUnload";
import { LocaleFormTab } from "@/components/elements/Misc/LocaleFormTab";

type CrudProps = {
    id: string;
    locale?: string;
};

const Update = ({ id, locale }: CrudProps) => {
    const mutation = useUpdateTopic();
    const confirmMutation = useConfirmTopic();

    const { setError, reset, setValue, resetField } = useFormContext();

    const [html, setHtml] = useState("");

    const { data: meta } = useTopicMeta();

    const [isValid, setValid] = useBoolean();
    const [isConfirm, setConfirm] = useBoolean();

    const modalAction = useDisclosure();

    const navigate = useNavigate();
    const contentsKey = useContentsKey();

    const query = useTopic({ id, locale });

    useFormBeforeUnload();

    useEffect(() => {
        if (query.isFetched && query.data !== undefined) {
            const { status, ...data } = query.data;

            reset(data);
            resetField("master_topic_categories");

            const masterTopicCategories = query.data.master_topic_categories;
            if (masterTopicCategories && masterTopicCategories.length > 0) {
                const formatData = masterTopicCategories.map((item) => item.id);

                setValue("master_topic_categories", formatData);
            }
            if (locale) {
                if (
                    query.data._translations !== undefined &&
                    query.data._translations[defaultLocale] !== undefined
                ) {
                    const defaultLocaleData =
                        query.data._translations[defaultLocale];
                    const masterTopicCategories =
                        defaultLocaleData.master_topic_categories;
                    if (
                        masterTopicCategories &&
                        masterTopicCategories.length > 0
                    ) {
                        const translateFormatData = masterTopicCategories.map(
                            (item) => item.id
                        );

                        setValue(
                            `_translations.${defaultLocale}.master_topic_categories`,
                            translateFormatData
                        );
                    }
                }
            }
        }
    }, [query.isFetched, query.data, locale]);

    const onSubmit: SubmitHandler<TopicFormValuesType> = async (values, e) => {
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
                    locale: locale,
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
                        // console.log(errorMessages);
                    }
                }
            }
        }
    };
    return (
        <>
            <LocaleFormTab id={id} locale={locale} />

            <FormWithPublicViewConfirm<TopicFormValuesType>
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
                    model={topicsModel}
                    isEdit={true}
                    isConfirm={isConfirm}
                    data={query.data}
                    locale={
                        locale && locale !== defaultLocale ? locale : undefined
                    }
                />
            </FormWithPublicViewConfirm>
        </>
    );
};

export default Update;
