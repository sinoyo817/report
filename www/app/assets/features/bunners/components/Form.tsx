import React from "react";

import { useBunnerMeta } from "../api/getBunnerMeta";
import { BaseCheckboxField } from "@/components/Form/BaseCheckboxField";
import { BaseDatePeriodField } from "@/components/Form/BaseDatePeriodField";
import { BaseDatePickerField } from "@/components/Form/BaseDatePickerField";
import { BaseImageField } from "@/components/Form/BaseImageField";
import { BaseInputField } from "@/components/Form/BaseInputField";

import { BunnerFormValuesType, BunnerType } from "../types";
import { getIsForeign } from "@/utils/getIsForeign";
import { Box, Heading, Center, Text } from "@chakra-ui/react";

type FormPropType = {
    model: string;
    isConfirm?: boolean;
    isEdit?: boolean;
    data?: BunnerType;
    locale?: string;    
};

const Form = (props: FormPropType) => {
    const { model, isConfirm = false, isEdit = false , locale } = props;

    const { data: meta } = useBunnerMeta();

    const isForeign = getIsForeign({ locale });

    return (
        <Box mb="2">
            <BaseInputField<BunnerFormValuesType>
                id="title"
                formType="input"
                model={model}
                isConfirm={isConfirm}
                label="タイトル"
                placeholder="タイトルを入力してください"
                defaultValue=""
                formControlOptions={{ isRequired: true }}
                rule={{
                    required: "タイトルを入力してください",
                }}
                locale={locale}
            />
            <BaseDatePickerField<BunnerFormValuesType>
                id="published"
                formType="date"
                model={model}
                isConfirm={isConfirm}
                label="登録日"
                placeholder="登録日を入力してください"
                defaultValue={new Date()
                    .toLocaleDateString()
                    .replaceAll("/", "-")}
                formControlOptions={{ isRequired: true }}
                rule={{ required: "登録日を入力してください" }}
                locale={locale}
            />
            <BaseDatePeriodField<BunnerFormValuesType>
                id="start_date"
                formType="datePeriod"
                model={model}
                isConfirm={isConfirm}
                periodLabel="公開期間"
                periodConnector="~"
                defaultValue=""
                periodGroup={{
                    start: {
                        id: "start_date",
                        formType: "date",
                        defaultValue: "",
                    },
                    end: {
                        id: "end_date",
                        formType: "date",
                        defaultValue: "",
                    },
                }}
                locale={locale}
            />
            <BaseImageField<BunnerFormValuesType>
                id="file_id"
                formType="image"
                model={model}
                isConfirm={isConfirm}
                label="バナー画像"
                defaultValue=""
                formControlOptions={{ isRequired: true }}
                rule={{ required: "バナー画像を登録してください" }}
                locale={locale}
            />
            <Center
                bg="red"
                color="white"
                borderRadius="md"
                justifyContent="center"
                alignItems="center"
                display="inline-flex"
                px="4"
            >
                <Text fontWeight="bold">※推奨サイズ 19:6</Text>
            </Center>
            <BaseInputField<BunnerFormValuesType>
                id="file_alt"
                formType="input"
                model={model}
                isConfirm={isConfirm}
                label="代替テキスト"
                placeholder="代替テキストを入力してください"
                defaultValue=""
                inputOptions={{
                    "data-accessibility": "text,alt",
                    "data-accessibility-target": "file_id",
                }}
                locale={locale}
            />
            <BaseInputField<BunnerFormValuesType>
                id="url"
                formType="input"
                inputType="url"
                model={model}
                isConfirm={isConfirm}
                label="タイトルリンクURL"
                placeholder="タイトルリンクURLを入力してください"
                defaultValue=""
                rule={{
                    pattern: {
                        value: /^https?:\/\/(.+?)\./,
                        message: "URLの形式を確認してください",
                    },
                }}
                inputOptions={{
                    "data-accessibility": "text,link",
                }}
                locale={locale}
            />
            <BaseCheckboxField<BunnerFormValuesType>
                id="url_is_blank"
                formType="checkbox"
                model={model}
                isConfirm={isConfirm}
                checkboxValueOption={{
                    value: "1",
                    label: "別ウィンドウで開く",
                }}
                defaultValue="0"
                checkboxOnDisplayText="別ウィンドウで開く"
                checkboxOffDisplayText="別ウィンドウで開かない"
                formControlOptions={{ my: 2 }}
                locale={locale}
            />
        </Box>
    );
};

export default Form;
