import React from "react";
import { BaseBlockEntityType, BaseBlockPropsType } from "@/types";
import { Box } from "@chakra-ui/react";
import { useMemo } from "react";

import { BaseCkeditorField } from "../BaseCkeditorField";
import { BaseCheckboxField } from "../BaseCheckboxField";

export const Wysiwyg = <S extends BaseBlockEntityType>(
    props: BaseBlockPropsType<S> & { showIgnoreWysiwygClass?: boolean }
) => {
    const {
        id,
        index,
        field,
        isConfirm,
        model,
        showIgnoreWysiwygClass = false,
        locale,
    } = props;

    return (
        <Box color="black">
            <BaseCkeditorField
                id={`${id}.${index}.value01`}
                formType="wysiwyg"
                label="文章(見たまま)"
                formControlOptions={{ isRequired: true }}
                rule={{ required: "文章(見たまま)を入力してください" }}
                placeholder={"文章(見たまま)を入力してください"}
                isConfirm={isConfirm}
                model={model}
                fileFieldName={`${id}.${index}.file_paths`}
                locale={locale}
            />
            {showIgnoreWysiwygClass && (
                <BaseCheckboxField
                    id={`${id}.${index}.value02`}
                    formType="checkbox"
                    defaultValue="0"
                    checkboxValueOption={{
                        label: "フリーページ用(wysiwygクラス無し)設定",
                        value: 1,
                    }}
                    checkboxOnDisplayText="フリーページ用設定"
                    isConfirm={isConfirm}
                    model={model}
                    formControlOptions={{ mt: 4 }}
                    locale={locale}
                />
            )}
        </Box>
    );
};
