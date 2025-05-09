import React, { useEffect, useState } from "react";
import { useUpdateMasterGroup } from "../api/updateMasterGroup";

import { useConfirmMasterGroup } from "../api/confirmMasterGroup";
import { useNavigate } from "react-router-dom";

import { useMasterGroup } from "../api/getMasterGroup";
import { MasterGroupFormValuesType } from "../types";


import { useBoolean, useDisclosure } from "@chakra-ui/react";

import Form from "./Form";
import { masterGroupsModel } from "../api/schema";

import { SubmitHandler, useFormContext } from "react-hook-form";
import { ResponseValidationType } from "@/types";
import { AxiosError } from "axios";

import { FormWithConfirm } from "@/components/Form/FormWithConfirm";

import { useContentsKey } from "@/features/misc/hooks/useContentsKey";
import { adminPrefix   } from "@/config";


type CrudProps = {
    id: string;
    
};

const Update = ({ id   }: CrudProps) => {
    const mutation = useUpdateMasterGroup();

    const confirmMutation =  useConfirmMasterGroup();


    const { setError, reset } = useFormContext();




    const [isValid, setValid] = useBoolean();
    const [isConfirm, setConfirm] = useBoolean();





    const navigate = useNavigate();
    const contentsKey = useContentsKey();


    const query = useMasterGroup({ id   });






    useEffect(() => {
        if (query.isFetched && query.data) {
            const { status, ...data } = query.data;
            reset(data);
        }
    }, [query.isFetched, query.data, reset]);

    const onSubmit: SubmitHandler<MasterGroupFormValuesType> = async (values) => {

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
                    }
                }
            }

        }

    };



    return (
        <>
         
        
         <FormWithConfirm<MasterGroupFormValuesType>
            onSubmit={onSubmit}
            isLoading={mutation.isLoading}
            isEdit={true}
            isConfirm={isConfirm}
            setConfirm={setConfirm}
            isConfirmLoading={confirmMutation.isLoading}
             
        >
            
                    <Form model={masterGroupsModel} isConfirm={isConfirm}  isEdit={true}    />
             
        </FormWithConfirm>
        
        </>
    );
};

export default Update;
