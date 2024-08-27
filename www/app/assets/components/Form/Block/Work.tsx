import React from "react";
import { BaseBlockEntityType, BaseBlockPropsType } from "@/types";
import {
    Box,
    Wrap,
    HStack,
} from "@chakra-ui/react";

import { BaseInputField } from "../BaseInputField";
import { BaseRemoteSelectField } from "../BaseRemoteSelectField";
import { BaseCheckboxField } from "../BaseCheckboxField";

import { useDayWorkMeta } from "@/features/day-works/api/getDayWorkMeta";

export const Work = <S extends BaseBlockEntityType>(
    props: BaseBlockPropsType<S>
) => {
    const { id, index, isConfirm, model, locale } = props;

    const { data: meta } = useDayWorkMeta();

    return (
        // <Box color="black">
            <Wrap>
                <HStack justify="center" spacing={4} alignItems="flex-end">
                    <Box width="45%">
                        {meta && (
                            <BaseRemoteSelectField
                                id={`${id}.${index}.value01`}
                                formType="remoteRadio"
                                label="案件名"
                                remoteDataKey="master_product_codes"
                                remoteDataIndexKey="title"
                                remoteDataValueKey="id"
                                placeholder="---"
                                meta={meta}
                                model={model}
                                isConfirm={isConfirm}
                                formControlOptions={{
                                    isRequired: true,
                                }}
                                rule={{
                                    required: "案件名を選択してください",
                                }}
                                useDefaultLocaleData={true}
                            />
                        )}
                    </Box>
                    <Box width="35%">
                    {meta && (
                        <BaseRemoteSelectField
                            id={`${id}.${index}.value02`}
                            formType="remoteRadio"
                            label="作業内容"
                            remoteDataKey="master_work_codes"
                            remoteDataIndexKey="title"
                            remoteDataValueKey="id"
                            placeholder="---"
                            meta={meta}
                            model={model}
                            isConfirm={isConfirm}
                            formControlOptions={{
                                isRequired: true,
                            }}
                            rule={{
                                required: "作業内容を選択してください",
                            }}
                            useDefaultLocaleData={true}
                        />
                    )}
                    </Box>
                    <Box width="10%">
                        <BaseInputField
                            id={`${id}.${index}.value04`}
                            formType="input"
                            label="作業時間"
                            formControlOptions={{ isRequired: true }}
                            rule={{
                                required: "作業時間を入力してください",
                            }}
                            placeholder={""}
                            isConfirm={isConfirm}
                            model={model}
                            locale={locale}
                        />
                    </Box>
                    <Box width="10%">
                        <BaseCheckboxField
                            id={`${id}.${index}.value05`}
                            formType="checkbox"
                            defaultValue="0"
                            checkboxValueOption={{ label: "日報に記載", value: 1 }}
                            checkboxOnDisplayText="日報に記載"
                            isConfirm={isConfirm}
                            model={model}
                            locale={locale}
                        />
                    </Box>
                </HStack>
            </Wrap>
        // </Box>
    );
};
