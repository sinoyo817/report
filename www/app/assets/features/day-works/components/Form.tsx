import React, { useEffect, useState } from "react";

import { useDayWorkMeta } from "../api/getDayWorkMeta";
import {
    Box,
    Button,
    ButtonGroup,
    Center,
    HStack,
    Heading,
    FormLabel,
    Text,
    Wrap,
    Input,
} from "@chakra-ui/react";
import { BaseInputField } from "@/components/Form/BaseInputField";
import { DayWorkFormValuesType, DayWorkType } from "../types";
import { useFormContext } from "react-hook-form";
import { BaseTextField } from "@/components/Form/BaseTextField";
import { BaseCheckboxField } from "@/components/Form/BaseCheckboxField";
import { BaseDatePickerField } from "@/components/Form/BaseDatePickerField";
import { BaseDatePeriodField } from "@/components/Form/BaseDatePeriodField";
import { BaseGroupField } from "@/components/Form/BaseGroupField";
import { BaseRemoteMultiCheckboxField } from "@/components/Form/BaseRemoteMultiCheckboxField";
import { BaseBlockField } from "@/components/Form/BaseBlockField";
import { BaseFieldWrapper } from "@/components/Form/BaseFieldWrapper";

// value03自動計算のcomponent
import Time from "./Time";
// ブロックの情報をテーブル表示するcomponent
import TimeTable from "./TimeTable";

type FormPropType = {
    model: string;
    isConfirm?: boolean;
    isEdit?: boolean;
    data?: DayWorkType;
};

const Form = (props: FormPropType) => {
    const { model, data, isConfirm = false, isEdit = false  } = props;

    const { data: meta } = useDayWorkMeta();

    return (
        <Box mb="2">
            <BaseDatePickerField<DayWorkFormValuesType>
                id="work_date"
                formType="date"
                model={model}
                isConfirm={isConfirm}
                label="作業日"
                placeholder="作業日を入力してください"
                defaultValue={new Date()
                    .toLocaleDateString()
                    .replaceAll("/", "-")}
                formControlOptions={{ isRequired: true }}
                rule={{ required: "作業日を入力してください" }}
            />
            <FormLabel>
                <Text as="span" size="xs" fontWeight="bold">
                    勤務時間帯
                </Text>
            </FormLabel>
            <Wrap>
                {/* <HStack spacing={1} justify="center"> */}
                    <BaseFieldWrapper w="60">
                        <BaseInputField<DayWorkFormValuesType>
                            id="start_time"
                            formType="input"
                            model={model}
                            isConfirm={isConfirm}
                            // label="開始時間"
                            placeholder="開始時間を入力してください"
                            defaultValue=""
                            // formControlOptions={{ isRequired: true }}
                            // rule={{ required: "開始時を入力してください" }}
                        />
                    </BaseFieldWrapper>
                {/* </HStack> */}
                <Box whiteSpace="nowrap" pt={1} fontSize="lg">
                    ~
                </Box>
                {/* <HStack spacing={1} justify="center"> */}
                    <BaseFieldWrapper w="60">
                        <BaseInputField<DayWorkFormValuesType>
                            id="end_time"
                            formType="input"
                            model={model}
                            isConfirm={isConfirm}
                            // label="終了時間"
                            placeholder="終了時間を入力してください"
                            defaultValue=""
                            // formControlOptions={{ isRequired: true }}
                            // rule={{ required: "開始時を入力してください" }}
                        />
                    </BaseFieldWrapper>
                {/* </HStack> */}
            </Wrap>
            <Text color="gray" mb={4}>
                ※ 日報記載用。工数の集計には影響しない。
            </Text>
            <Time />
            <BaseBlockField<DayWorkFormValuesType>
                id="blocks"
                formType="block"
                model={model}
                blockModel={model}
                isConfirm={isConfirm}
                label="工数"
                blockType="works"
                defaultValue={[]}
            />
            <BaseInputField<DayWorkFormValuesType>
                id="block"
                formType="input"
                model={model}
                isConfirm={isConfirm}
                label="工数"
                placeholder="タイトルを入力してください"
                defaultValue="1"
                useDefaultLocaleData={true}
                inputType="hidden"
            />
            <TimeTable />
        </Box>
    );
};

export default Form;
