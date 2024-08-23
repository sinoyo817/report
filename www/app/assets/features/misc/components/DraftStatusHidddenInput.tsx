import React from "react";
import { BaseInputField } from "@/components/Form/BaseInputField";

export type DraftHiddenInputProps = {
    model: string;
    id?: string;
    value?: string;
};

export const DraftHiddenInput = (props: DraftHiddenInputProps) => {
    const { id = "status", model, value = "draft" } = props;

    return (
        <BaseInputField
            id={id}
            formType="input"
            inputType="hidden"
            defaultValue={value}
            model={model}
        />
    );
};
