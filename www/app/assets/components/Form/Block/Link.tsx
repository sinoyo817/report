import React from "react";
import { BaseBlockEntityType, BaseBlockPropsType } from "@/types";
import { Box } from "@chakra-ui/react";

import { memo } from "react";
import { BaseCheckboxField } from "../BaseCheckboxField";
import { BaseInputField } from "../BaseInputField";

export const Link = <S extends BaseBlockEntityType>(
    props: BaseBlockPropsType<S>
) => {
    const { id, index, isConfirm, model, locale } = props;

    return (
        <Box color="black">
            <BaseInputField
                id={`${id}.${index}.value01`}
                formType="input"
                label="リンクURL"
                placeholder={"リンクURLを入力してください"}
                rule={{
                    pattern: {
                        value: /^(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)|\/(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*))/,
                        message: "リンクURLの形式を確認してください",
                    },
                    required: "リンクURLを入力してください",
                }}
                formControlOptions={{ isRequired: true }}
                isConfirm={isConfirm}
                model={model}
                inputOptions={{
                    "data-accessibility": "text,link",
                }}
                locale={locale}
            />
            <BaseCheckboxField
                id={`${id}.${index}.value03`}
                formType="checkbox"
                defaultValue="0"
                checkboxValueOption={{ label: "別ウインドウで開く", value: 1 }}
                checkboxOnDisplayText="別ウインドウで開く"
                isConfirm={isConfirm}
                model={model}
                locale={locale}
            />
            <BaseInputField
                id={`${id}.${index}.value02`}
                formType="input"
                label="リンク名"
                placeholder={"リンク名を入力してください"}
                formControlOptions={{ isRequired: true }}
                rule={{
                    required: "リンク名を入力してください",
                }}
                isConfirm={isConfirm}
                model={model}
                locale={locale}
            />
        </Box>
    );
};
