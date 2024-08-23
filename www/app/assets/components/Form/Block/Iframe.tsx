import React from "react";
import { BaseBlockEntityType, BaseBlockPropsType } from "@/types";
import { Box } from "@chakra-ui/react";

import { BaseInputField } from "../BaseInputField";

import { BaseTextField } from "../BaseTextField";

export const Iframe = <S extends BaseBlockEntityType>(
    props: BaseBlockPropsType<S>
) => {
    const { id, index, isConfirm, model, locale } = props;

    return (
        <Box color="black">
            <BaseTextField
                id={`${id}.${index}.value02`}
                formType="textarea"
                label="埋め込み(iframe)"
                formControlOptions={{ isRequired: true }}
                rule={{
                    required: "埋め込み(iframe)を入力してください",
                    pattern: {
                        value: /^<iframe.*<\/iframe>$/,
                        message: "iframeの形式を確認してください",
                    },
                }}
                placeholder={"埋め込み(iframe)を入力してください"}
                isConfirm={isConfirm}
                model={model}
                allowIframe={true}
                locale={locale}
            />
            <BaseInputField
                id={`${id}.${index}.value01`}
                formType="input"
                label="タイトル"
                placeholder={"タイトルを入力してください"}
                isConfirm={isConfirm}
                model={model}
                locale={locale}
            />
        </Box>
    );
};
