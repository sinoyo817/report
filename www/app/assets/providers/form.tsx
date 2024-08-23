import React from "react";
import {
    FormProvider as ReactHookFormProvider,
    useForm,
} from "react-hook-form";

type FormProviderProps = {
    children: React.ReactNode;
};

export const FormProvider = ({ children }: FormProviderProps) => {
    const methods = useForm({ mode: "onSubmit" });
    return (
        <ReactHookFormProvider {...methods}>{children}</ReactHookFormProvider>
    );
};
