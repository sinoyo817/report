import React from "react";
import { BaseBlockEntityType, BaseBlockPropsType } from "@/types";
import { Box, Divider } from "@chakra-ui/react";
import { BaseCheckboxField } from "../BaseCheckboxField";

import { BaseImageField } from "../BaseImageField";
import { BaseInputField } from "../BaseInputField";

export const ImageTwo = <S extends BaseBlockEntityType>(
    props: BaseBlockPropsType<S>
) => {
    const { id, index, isConfirm, model, locale } = props;

    return (
        <Box color="black">
            <BaseImageField
                id={`${id}.${index}.file01_id`}
                formType="image"
                label="画像"
                formControlOptions={{ isRequired: true }}
                rule={{ required: "画像を選択してください" }}
                isConfirm={isConfirm}
                model={model}
                inputOptions={{
                    "data-accessibility": "image,alt",
                    "data-accessibility-target": `${id}.${index}.value01`,
                }}
                locale={locale}
            />
            <BaseInputField
                id={`${id}.${index}.value01`}
                formType="input"
                label="代替テキスト"
                placeholder={"代替テキストを入力してください"}
                isConfirm={isConfirm}
                model={model}
                inputOptions={{
                    "data-accessibility": "text",
                }}
                locale={locale}
            />
            <BaseInputField
                id={`${id}.${index}.value02`}
                formType="input"
                label="キャプション"
                placeholder={"キャプションを入力してください"}
                isConfirm={isConfirm}
                model={model}
                inputOptions={{
                    "data-accessibility": "text",
                }}
                locale={locale}
            />
            <BaseInputField
                id={`${id}.${index}.value03`}
                formType="input"
                label="リンクURL"
                placeholder={"リンクURLを入力してください"}
                isConfirm={isConfirm}
                model={model}
                rule={{
                    pattern: {
                        value: /^(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)|\/(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*))/,
                        message: "リンクURLの形式を確認してください",
                    },
                }}
                inputOptions={{
                    "data-accessibility": "text,link",
                }}
                locale={locale}
            />
            <BaseCheckboxField
                id={`${id}.${index}.value04`}
                formType="checkbox"
                label="別ウインドウで開く"
                defaultValue="0"
                checkboxValueOption={{ value: 1 }}
                checkboxOnDisplayText="開く"
                isConfirm={isConfirm}
                model={model}
                locale={locale}
            />
            <Divider my="2" />
            <BaseImageField
                id={`${id}.${index}.file02_id`}
                formType="image"
                label="画像2"
                formControlOptions={{ isRequired: true }}
                rule={{ required: "画像を選択してください" }}
                isConfirm={isConfirm}
                model={model}
                inputOptions={{
                    "data-accessibility": "image,alt",
                    "data-accessibility-target": `${id}.${index}.value11`,
                }}
                locale={locale}
            />
            <BaseInputField
                id={`${id}.${index}.value11`}
                formType="input"
                label="代替テキスト"
                placeholder={"代替テキストを入力してください"}
                isConfirm={isConfirm}
                model={model}
                inputOptions={{
                    "data-accessibility": "text",
                }}
                locale={locale}
            />
            <BaseInputField
                id={`${id}.${index}.value12`}
                formType="input"
                label="キャプション"
                placeholder={"キャプションを入力してください"}
                isConfirm={isConfirm}
                model={model}
                inputOptions={{
                    "data-accessibility": "text",
                }}
                locale={locale}
            />
            <BaseInputField
                id={`${id}.${index}.value13`}
                formType="input"
                label="リンクURL"
                placeholder={"リンクURLを入力してください"}
                isConfirm={isConfirm}
                model={model}
                rule={{
                    pattern: {
                        value: /^(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)|\/(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*))/,
                        message: "リンクURLの形式を確認してください",
                    },
                }}
                inputOptions={{
                    "data-accessibility": "text,link",
                }}
                locale={locale}
            />
            <BaseCheckboxField
                id={`${id}.${index}.value14`}
                formType="checkbox"
                label="別ウインドウで開く"
                defaultValue="0"
                checkboxValueOption={{ value: 1 }}
                checkboxOnDisplayText="開く"
                isConfirm={isConfirm}
                model={model}
                locale={locale}
            />
        </Box>
    );
};
