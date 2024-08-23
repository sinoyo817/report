import { BaseFieldWrapper } from "@/components/Form/BaseFieldWrapper";
import { BaseInputField } from "@/components/Form/BaseInputField";
import { BaseTextField } from "@/components/Form/BaseTextField";
import { BasePasswordConfirmField } from "@/components/Form/BasePasswordConfirmField";
import { BaseSelectField } from "@/components/Form/BaseSelectField";
import {
    Box,
    FormControl,
    FormLabel,
    HStack,
    SimpleGrid,
    Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useAdminMeta } from "../api/getAdminMeta";
import { AdminFormValuesType, AdminType } from "../types";

type FormPropType = {
    model: string;
    isConfirm: boolean;
    isEdit?: boolean;
};

const Form = (props: FormPropType) => {
    const { model, isConfirm, isEdit = false } = props;

    const { data: meta } = useAdminMeta();

    return (
        <Box>
            <BaseInputField<AdminFormValuesType>
                id="username"
                formType="input"
                model={model}
                isConfirm={isConfirm}
                label="ユーザ名"
                placeholder="ユーザ名を入力してください"
                defaultValue=""
                formControlOptions={{ isRequired: true }}
                rule={{
                    required: "ユーザ名を入力してください",
                    minLength: {
                        value: 8,
                        message: "ユーザ名は8文字以上入力してください",
                    },
                    pattern: {
                        value: /^[a-zA-z0-9_]+$/,
                        message: "英数字混在で入力してください",
                    },
                }}
            />
            <BaseSelectField<AdminFormValuesType>
                id="role"
                formType="select"
                model={model}
                isConfirm={isConfirm}
                label="権限"
                placeholder="---"
                defaultValue=""
                formControlOptions={{ isRequired: true }}
                rule={{
                    required: "権限を選択してください",
                }}
                multipleValueOptions={
                    meta?.role &&
                    meta.role.map((item) => ({
                        label: item.title,
                        value: item.role,
                    }))
                }
            />
            <BaseInputField<AdminFormValuesType>
                id="email"
                formType="input"
                inputType="email"
                model={model}
                isConfirm={isConfirm}
                label="メールアドレス"
                placeholder="メールアドレスを入力してください"
                defaultValue=""
                formControlOptions={{ isRequired: true }}
                rule={{
                    required: "メールアドレスを入力してください",
                }}
            />
            <BasePasswordConfirmField<AdminFormValuesType>
                id={"password_new"}
                formType={"passwordConfirm"}
                label={isEdit ? "新パスワード" : "パスワード"}
                placeholder="パスワードを入力してください"
                defaultValue=""
                model={model}
                isConfirm={isConfirm}
                formControlOptions={{ isRequired: !isEdit }}
                helpText="半角数字、半角英小文字、半角英文字、記号8文字以上、 72文字以内のパスワードを設定してください。"
                rule={{
                    required: isEdit ? false : "パスワードを入力してください",
                    minLength: {
                        value: 8,
                        message: "パスワードは8文字以上入力してください",
                    },
                    maxLength: {
                        value: 72,
                        message: "パスワードは72文字以内入力してください",
                    },
                    pattern: {
                        value: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])[a-zA-z0-9_]+$/,
                        message: "英[大文字小文字]数混在で入力してください",
                    },
                }}
            />
            <BaseInputField<AdminFormValuesType>
                id="title"
                formType="input"
                label="名前"
                model={model}
                isConfirm={isConfirm}
                placeholder="名前を入力してください"
                defaultValue=""
                formControlOptions={{ isRequired: true }}
                rule={{ required: "名前を入力してください" }}
            />
            
            <BaseTextField<AdminFormValuesType>
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
