import React from "react";

import { useToDoMeta } from "../api/getToDoMeta";
import { ToDoFormValuesType, ToDoType } from "../types";

import { BaseBlockField } from "@/components/Form/BaseBlockField";
import { BaseInputField } from "@/components/Form/BaseInputField";
import { BaseTextField } from "@/components/Form/BaseTextField";
import { BaseGroupField } from "@/components/Form/BaseGroupField";

import { Box } from "@chakra-ui/react";

type FormPropType = {
    model: string;
    isConfirm?: boolean;
    isEdit?: boolean;
    data?: ToDoType;
};

const Form = (props: FormPropType) => {
    const { model, isConfirm = false, isEdit = false, data  } = props;

    const { data: meta } = useToDoMeta();

    return (
        <Box mb="2">
            <BaseInputField<ToDoFormValuesType>
                id="title"
                formType="input"
                model={model}
                isConfirm={isConfirm}
                label="タイトル"
                placeholder="タイトルを入力してください"
                defaultValue=""
                formControlOptions={{ isRequired: true }}
                rule={{
                    required: "タイトルを入力してください",
                }}
            />
            <BaseTextField<ToDoFormValuesType>
                id="summary"
                formType="textarea"
                model={model}
                isConfirm={isConfirm}
                label="詳細"
                placeholder="詳細を入力してください"
            />
            <BaseTextField<ToDoFormValuesType>
                id="note"
                formType="textarea"
                model={model}
                isConfirm={isConfirm}
                label="備考"
                placeholder="備考を入力してください"
            />
        </Box>
    );
};

export default Form;
