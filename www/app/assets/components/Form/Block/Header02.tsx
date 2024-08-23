import React from "react";
import { BaseBlockEntityType, BaseBlockPropsType } from "@/types";
import { Box } from "@chakra-ui/react";

import { BaseInputField } from "../BaseInputField";

export const Header02 = <S extends BaseBlockEntityType>(
    props: BaseBlockPropsType<S>
) => {
    const { id, index, isConfirm, model, locale } = props;

    return (
        <Box color="black">
            <BaseInputField
                id={`${id}.${index}.value01`}
                formType="input"
                label="見出し(小)"
                formControlOptions={{ isRequired: true }}
                rule={{ required: "見出し(小)を入力してください" }}
                placeholder={"見出し(小)を入力してください"}
                isConfirm={isConfirm}
                model={model}
                locale={locale}
            />
        </Box>
    );
};
