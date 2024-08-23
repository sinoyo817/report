import React, { useRef } from "react";
import { Box, BoxProps } from "@chakra-ui/react";
import { SubmitHandler, FieldValues, useFormContext } from "react-hook-form";
import { BaseView } from "../elements/Misc/BaseView";

type FormProps<TFormValues extends FieldValues> = {
    onSubmit: SubmitHandler<TFormValues>;
    children: React.ReactNode;
    id?: string;
    formRef?: React.RefObject<HTMLFormElement>;
} & Omit<BoxProps, "onSubmit" | "children" | "id">;

export const BaseForm = <TFormValues extends FieldValues>({
    onSubmit,
    children,
    id,
    formRef,
    ...boxProps
}: FormProps<TFormValues>) => {
    const methods = useFormContext<TFormValues>();

    return (
        <form onSubmit={methods.handleSubmit(onSubmit)} id={id} ref={formRef}>
            <BaseView {...boxProps}>{children}</BaseView>
        </form>
    );
};
