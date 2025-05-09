import React from "react";
import { useCreateMasterGroup } from "../api/createMasterGroup";

import { useConfirmMasterGroup } from "../api/confirmMasterGroup";
import { useNavigate } from "react-router-dom";

import { MasterGroupFormValuesType } from "../types";


import { useBoolean, useDisclosure } from "@chakra-ui/react";

import Form from "./Form";
import { masterGroupsModel } from "../api/schema";

import { SubmitHandler, useFormContext } from "react-hook-form";
import { useState } from "react";
import { ResponseValidationType } from "@/types";
import { AxiosError } from "axios";

import { FormWithConfirm } from "@/components/Form/FormWithConfirm";

import { useContentsKey } from "@/features/misc/hooks/useContentsKey";
import { adminPrefix } from "@/config";

const Create = () => {
    const mutation = useCreateMasterGroup();

    const confirmMutation =  useConfirmMasterGroup();


    const { setError } = useFormContext();




    const [isValid, setValid] = useBoolean();
    const [isConfirm, setConfirm] = useBoolean();





    const navigate = useNavigate();
    const contentsKey = useContentsKey();





    const onSubmit: SubmitHandler<MasterGroupFormValuesType> = async (values) => {

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
        
         <FormWithConfirm<MasterGroupFormValuesType>
            onSubmit={onSubmit}
            isLoading={mutation.isLoading}
            isEdit={false}
            isConfirm={isConfirm}
            setConfirm={setConfirm}
            isConfirmLoading={confirmMutation.isLoading}
           
        >
             
                    <Form model={masterGroupsModel} isConfirm={isConfirm} />
             
        </FormWithConfirm>
        
    );
};

export default Create;
