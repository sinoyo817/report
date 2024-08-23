import React from "react";
import { BaseBlockEntityType, BaseBlockPropsType } from "@/types";
import { Box } from "@chakra-ui/react";

import { BaseFileField } from "../BaseFileField";
import { BaseInputField } from "../BaseInputField";

export const File = <S extends BaseBlockEntityType>(
    props: BaseBlockPropsType<S>
) => {
    const { id, index, isConfirm, model, locale } = props;

    return (
        <Box color="black">
            <BaseFileField
                id={`${id}.${index}.file01_id`}
                formType="file"
                label="ファイル"
                formControlOptions={{ isRequired: true }}
                rule={{ required: "ファイルを選択してください" }}
                isConfirm={isConfirm}
                model={model}
                locale={locale}
            />
            <BaseInputField
                id={`${id}.${index}.value01`}
                formType="input"
                label="ファイル名"
                formControlOptions={{ isRequired: true }}
                placeholder={"ファイル名を入力してください"}
                rule={{ required: "ファイル名を入力してください" }}
                isConfirm={isConfirm}
                model={model}
                locale={locale}
            />
        </Box>
    );
};
