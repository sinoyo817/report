import React, { useEffect, useState } from "react";
import { useUpdateFreepageDirectory } from "../api/updateFreepageDirectory";

import { useNavigate } from "react-router-dom";

import { useFreepageDirectory } from "../api/getFreepageDirectory";
import { FreepageDirectoryFormValuesType } from "../types";

import { useFreepageDirectoryMeta } from "../api/getFreepageDirectoryMeta";

import { useBoolean, useDisclosure } from "@chakra-ui/react";

import { SubmitHandler, useFormContext } from "react-hook-form";
import { ResponseValidationType } from "@/types";
import { AxiosError } from "axios";
import { useContentsKey } from "@/features/misc/hooks/useContentsKey";
import { adminPrefix } from "@/config";
import { FormWithoutConfirm } from "@/components/Form/FormWithoutConfirm";
import DirectoryForm from "./DirectoryForm";

type CrudProps = {
    id: string;
};

const UpdateDir = ({ id }: CrudProps) => {
    const mutation = useUpdateFreepageDirectory();

    const { setError, reset } = useFormContext();

    const navigate = useNavigate();
    const contentsKey = useContentsKey();

    const query = useFreepageDirectory({ id });

    const { data: meta } = useFreepageDirectoryMeta();

    useEffect(() => {
        if (query.isFetched && query.data) {
            const { status, ...data } = query.data;
            reset(data);
        }
    }, [query.isFetched, query.data, reset]);

    const onSubmit: SubmitHandler<FreepageDirectoryFormValuesType> = async (
        values
    ) => {
        const data = await mutation.mutateAsync({ data: values, id: id });

        navigate(`${adminPrefix}${contentsKey}`);
    };

    return (
        <FormWithoutConfirm<FreepageDirectoryFormValuesType>
            onSubmit={onSubmit}
            isLoading={mutation.isLoading}
            isEdit={true}
            isBack={true}
        >
            {query.data && (
                <DirectoryForm data={query.data} meta={meta} isEdit={true} />
            )}
        </FormWithoutConfirm>
    );
};

export default UpdateDir;
