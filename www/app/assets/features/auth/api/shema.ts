import { FormFieldType } from "@/types";
import { AuthFormValueType, AuthPasswordFormValueType } from "../types";

export const authModel = "Admins";

export const authFields: FormFieldType<AuthFormValueType>[] = [
    {
        id: "title",
        formType: "input",
        label: "管理者名",
        placeholder: "管理者名を入力してください",
        defaultValue: "",
        formControlOptions: { isRequired: true },
        rule: { required: "管理者名を入力してください" },
    },
    {
        id: "username",
        formType: "input",
        label: "ユーザ名",
        placeholder: "ユーザ名を入力してください",
        defaultValue: "",
        formControlOptions: { isRequired: true },
        rule: {
            required: "ユーザ名を入力してください",
            minLength: {
                value: 8,
                message: "ユーザ名は8文字以上入力してください",
            },
            pattern: {
                value: /^[a-zA-z0-9_]+$/,
                message: "英数字混在で入力してください",
            },
        },
    },
    {
        id: "password_new",
        formType: "passwordConfirm",
        label: "新パスワード",
        rule: {
            minLength: {
                value: 14,
                message: "パスワードは14文字以上入力してください",
            },
            pattern: {
                value: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])[a-zA-z0-9_]+$/,
                message: "英[大文字小文字]数混在で入力してください",
            },
        },
        placeholder: "パスワードを入力してください",
        defaultValue: "",
    },
    {
        id: "email",
        formType: "input",
        inputType: "email",
        label: "メールアドレス",
        placeholder: "メールアドレスを入力してください",
        defaultValue: "",
        formControlOptions: { isRequired: true },
        rule: { required: "メールアドレスを入力してください" },
    },
];

export const authPasswordFields: FormFieldType<AuthPasswordFormValueType>[] = [
    {
        id: "current_password",
        formType: "input",
        inputType: "password",
        label: "現在のパスワード",
        placeholder: "現在のパスワードを入力してください",
        defaultValue: "",
        formControlOptions: { isRequired: true },
        rule: { required: "現在のパスワードを入力してください" },
    },
    {
        id: "password_new",
        formType: "passwordConfirm",
        label: "新規パスワード",
        formControlOptions: { isRequired: true },
        rule: {
            required: "新規パスワードパスワードを入力してください",
            minLength: {
                value: 14,
                message: "パスワードは14文字以上入力してください",
            },
            pattern: {
                value: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])[a-zA-z0-9_]+$/,
                message: "英[大文字小文字]数混在で入力してください",
            },
        },
        placeholder: "新規パスワードを入力してください",
        defaultValue: "",
    },
];
