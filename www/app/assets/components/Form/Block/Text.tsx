import React from "react";
import { BaseBlockEntityType, BaseBlockPropsType } from "@/types";
import { Box } from "@chakra-ui/react";

import { BaseTextField } from "../BaseTextField";

export const Text = <S extends BaseBlockEntityType>(
    props: BaseBlockPropsType<S>
) => {
    const { id, index, isConfirm, model, locale } = props;

    return (
        <Box color="black">
            <BaseTextField
                id={`${id}.${index}.value01`}
                formType="textarea"
                label="文章"
                formControlOptions={{ isRequired: true }}
                rule={{ required: "文章を入力してください" }}
                placeholder={"文章を入力してください"}
                isConfirm={isConfirm}
                model={model}
                locale={locale}
            />
        </Box>
    );
};
