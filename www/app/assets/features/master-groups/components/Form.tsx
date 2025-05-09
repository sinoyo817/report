import React from "react";

import { useMasterGroupMeta } from "../api/getMasterGroupMeta";
import { MasterGroupFormValuesType, MasterGroupType } from "../types";

import { BaseInputField } from "@/components/Form/BaseInputField";
import { BaseTextField } from "@/components/Form/BaseTextField";
import { BaseSelectField } from "@/components/Form/BaseSelectField";
import {
    Box,
    Button,
    ButtonGroup,
    Center,
    HStack,
    Heading,
    FormLabel,
    Text,
    Wrap,
} from "@chakra-ui/react";

type FormPropType = {
    model: string;
    isConfirm?: boolean;
    isEdit?: boolean;
    data?: MasterGroupType;
};

const Form = (props: FormPropType) => {
    const { model, data, isConfirm = false, isEdit = false  } = props;

    const { data: meta } = useMasterGroupMeta();

    return (
        <Box>
            <BaseInputField<MasterGroupFormValuesType>
                id="title"
                formType="input"
                model={model}
                isConfirm={isConfirm}
                label="グループ名"
                placeholder="グループ名を入力してください"
                defaultValue=""
                formControlOptions={{ isRequired: true }}
            />
            <BaseInputField<MasterGroupFormValuesType>
                id="email"
                formType="input"
                inputType="email"
                model={model}
                isConfirm={isConfirm}
                label="日報送信先メールアドレス"
                placeholder="日報送信先メールアドレスを入力してください"
                defaultValue=""
                // formControlOptions={{ isRequired: true }}
                // rule={{
                //     required: "メールアドレスを入力してください",
                // }}
            />
            {/* <BaseTextField<MasterGroupFormValuesType>
                id="mail_body"
                formType="textarea"
                model={model}
                isConfirm={isConfirm}
                label="日報本文"
                placeholder="日報本文を入力してください"
            /> */}
            <BaseTextField<MasterGroupFormValuesType>
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
