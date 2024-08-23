import React from "react";

import { useTopImageMeta } from "../api/getTopImageMeta";
import { BaseCheckboxField } from "@/components/Form/BaseCheckboxField";
import { BaseDatePeriodField } from "@/components/Form/BaseDatePeriodField";
import { BaseDatePickerField } from "@/components/Form/BaseDatePickerField";
import { BaseImageField } from "@/components/Form/BaseImageField";
import { BaseInputField } from "@/components/Form/BaseInputField";

import { TopImageFormValuesType, TopImageType } from "../types";
import { BaseRemoteMultiCheckboxField } from "@/components/Form/BaseRemoteMultiCheckboxField";
import { BaseRemoteSelectField } from "@/components/Form/BaseRemoteSelectField";
import { BaseTextField } from "@/components/Form/BaseTextField";
import { BaseGroupField } from "@/components/Form/BaseGroupField";
import { getIsForeign } from "@/utils/getIsForeign";
import { BaseForeignBlockField } from "@/components/Form/BaseForeignBlockField";

import { Box, Heading, Center, Text } from "@chakra-ui/react";

type FormPropType = {
    model: string;
    isConfirm?: boolean;
    isEdit?: boolean;
    data?: TopImageType;
    locale?: string;
};

const Form = (props: FormPropType) => {
    const { model, isConfirm = false, isEdit = false , locale } = props;

    const { data: meta } = useTopImageMeta();

    const isForeign = getIsForeign({ locale });

    return (
        <Box mb="2">
            <BaseInputField<TopImageFormValuesType>
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
            <BaseDatePickerField<TopImageFormValuesType>
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
            <BaseDatePeriodField<TopImageFormValuesType>
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
            <Box bg={"white"} borderWidth="1px" p="5" my="5" rounded="2xl">
                <Center
                    bg="cyan.100"
                    h="30px"
                    p="3"
                    rounded="2xl"
                    justifyContent="center"
                    alignItems="center"
                    display="inline-flex"
                    mt="3"
                    my="3"
                >
                    <Heading as="h6" size="md">
                        PC画像
                    </Heading>
                </Center>  
                <Box my="3">
                    <BaseImageField<TopImageFormValuesType>
                        id="image_id"
                        formType="image"
                        model={model}
                        isConfirm={isConfirm}
                        label="PC画像"
                        defaultValue=""
                        formControlOptions={{ isRequired: true }}
                        rule={{ required: "PC画像を登録してください" }}
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
                        <Text fontWeight="bold">※推奨サイズ 1920×720px</Text>
                    </Center>
                </Box>
                <BaseInputField<TopImageFormValuesType>
                    id="image_alt"
                    formType="input"
                    model={model}
                    isConfirm={isConfirm}
                    label="PC画像代替テキスト"
                    placeholder="PC画像代替テキストを入力してください"
                    defaultValue=""
                    inputOptions={{
                        "data-accessibility": "text,alt",
                        "data-accessibility-target": "file_id",
                    }}
                    locale={locale}
                />
                <BaseInputField<TopImageFormValuesType>
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
                <BaseCheckboxField<TopImageFormValuesType>
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

            <Box bg={"white"} borderWidth="1px" p="5" my="5" rounded="2xl">
                <Center
                    bg="cyan.100"
                    h="30px"
                    p="3"
                    rounded="2xl"
                    justifyContent="center"
                    alignItems="center"
                    display="inline-flex"
                    mt="3"
                    my="3"
                >
                    <Heading as="h6" size="md">
                        SP画像
                    </Heading>
                </Center>
                <Box my="3">     
                    <BaseImageField<TopImageFormValuesType>
                        id="sp_image_id"
                        formType="image"
                        model={model}
                        isConfirm={isConfirm}
                        label="SP画像"
                        defaultValue=""
                        formControlOptions={{ isRequired: true }}
                        rule={{ required: "SP画像を登録してください" }}
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
                        <Text fontWeight="bold">※推奨サイズ 720×900px</Text>
                    </Center>
                </Box>
                <BaseInputField<TopImageFormValuesType>
                    id="sp_image_alt"
                    formType="input"
                    model={model}
                    isConfirm={isConfirm}
                    label="SP画像代替テキスト"
                    placeholder="SP画像代替テキストを入力してください"
                    defaultValue=""
                    inputOptions={{
                        "data-accessibility": "text,alt",
                        "data-accessibility-target": "file_id",
                    }}
                    locale={locale}
                />
                <BaseInputField<TopImageFormValuesType>
                    id="sp_url"
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
                <BaseCheckboxField<TopImageFormValuesType>
                    id="sp_url_is_blank"
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
        </Box>
    );
};

export default Form;
