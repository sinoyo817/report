import React, { useEffect, useState } from "react";

import { BaseBlockField } from "@/components/Form/BaseBlockField";
import { BaseCheckboxField } from "@/components/Form/BaseCheckboxField";
import { BaseDatePeriodField } from "@/components/Form/BaseDatePeriodField";
import { BaseDatePickerField } from "@/components/Form/BaseDatePickerField";
import { BaseImageField } from "@/components/Form/BaseImageField";
import { BaseInputField } from "@/components/Form/BaseInputField";
import { Box } from "@chakra-ui/react";

import { useTopicMeta } from "../api/getTopicMeta";

import { TopicFormValuesType, TopicType } from "../types";
import { BaseRemoteMultiCheckboxField } from "@/components/Form/BaseRemoteMultiCheckboxField";
import { BaseRemoteSelectField } from "@/components/Form/BaseRemoteSelectField";
import { BaseTextField } from "@/components/Form/BaseTextField";
import { BaseGroupField } from "@/components/Form/BaseGroupField";
import { getIsForeign } from "@/utils/getIsForeign";
import { BaseForeignBlockField } from "@/components/Form/BaseForeignBlockField";

type FormPropType = {
    model: string;
    isConfirm?: boolean;
    isEdit?: boolean;
    data?: TopicType;
    locale?: string;
};

const Form = (props: FormPropType) => {
    const { model, isConfirm = false, isEdit = false, data, locale } = props;

    const { data: meta } = useTopicMeta();

    const isForeign = getIsForeign({ locale });

    return (
        <Box mb="2">
            <BaseInputField<TopicFormValuesType>
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
            {meta && (
                <>
                    {meta.settings.category === "multi" && (
                        <BaseRemoteMultiCheckboxField<TopicFormValuesType>
                            id="master_topic_categories"
                            formType="remoteMultiCheckbox"
                            label="カテゴリ"
                            remoteDataKey="master_topic_categories"
                            remoteDataIndexKey="title"
                            remoteDataValueKey="id"
                            meta={meta}
                            model={model}
                            isConfirm={isConfirm}
                            formControlOptions={{
                                isRequired: true,
                            }}
                            rule={{
                                required: "カテゴリを選択してください",
                            }}
                            locale={locale}
                            useDefaultLocaleData={true}
                        />
                    )}
                    {meta.settings.category === "single" && (
                        <BaseRemoteSelectField<TopicFormValuesType>
                            id="master_topic_category_id"
                            formType="remoteRadio"
                            label="カテゴリ"
                            remoteDataKey="master_topic_categories"
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
                                required: "カテゴリを選択してください",
                            }}
                            locale={locale}
                            useDefaultLocaleData={true}
                        />
                    )}
                </>
            )}
            <BaseDatePickerField<TopicFormValuesType>
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
            <BaseDatePeriodField<TopicFormValuesType>
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
            <BaseInputField<TopicFormValuesType>
                id="slug"
                formType="input"
                model={model}
                isConfirm={isConfirm}
                label="ページURL"
                helpText="※半角英数字で入力。ページURLの末尾になります。"
                placeholder="ページURLを入力してください"
                defaultValue=""
                // formControlOptions={{ isRequired: true }}
                rule={{
                    // required: "ページURLを入力してください",
                    pattern: {
                        value: /^[a-zA-Z0-9_\-]*$/,
                        message: "ページURLの形式を確認してください",
                    },
                }}
                locale={locale}
                ignoreForeign={true}
            />

            <BaseInputField<TopicFormValuesType>
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
            <BaseCheckboxField<TopicFormValuesType>
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
            {meta && meta.settings.summary === "on" && (
                <>
                    <BaseTextField<TopicFormValuesType>
                        id="summary"
                        formType="textarea"
                        model={model}
                        isConfirm={isConfirm}
                        label="サマリーテキスト"
                        placeholder="サマリーテキストを入力してください"
                        locale={locale}
                    />
                </>
            )}
            {meta && meta.settings.thumbnail === "on" && (
                <>
                    <BaseImageField<TopicFormValuesType>
                        id="file_id"
                        formType="image"
                        model={model}
                        isConfirm={isConfirm}
                        label="サムネイル画像"
                        defaultValue=""
                        locale={locale}
                    />
                    <BaseInputField<TopicFormValuesType>
                        id="file_alt"
                        formType="input"
                        model={model}
                        isConfirm={isConfirm}
                        label="サムネイル画像代替テキスト"
                        placeholder="サムネイル画像代替テキストを入力してください"
                        defaultValue=""
                        inputOptions={{
                            "data-accessibility": "text,alt",
                            "data-accessibility-target": "file_id",
                        }}
                        locale={locale}
                    />
                </>
            )}

            <BaseGroupField<TopicFormValuesType>
                id="metadata"
                formType="group"
                model={model}
                groupLabel="メタデータ"
                locale={locale}
                group={[
                    {
                        id: "metadata.description",
                        formType: "textarea",
                        label: "デスクリプション",
                        placeholder: "デスクリプションを入力してください",
                        defaultValue: "",
                        locale: locale,
                    },
                    {
                        id: "metadata.keywords",
                        formType: "textarea",
                        label: "キーワード",
                        placeholder: "キーワードを入力してください",
                        defaultValue: "",
                        locale: locale,
                    },
                    {
                        id: "metadata.file_id",
                        formType: "image",
                        label: "OGP画像(SNS投稿画像)",
                        defaultValue: "",
                        locale: locale,
                    },
                    {
                        id: "metadata.model",
                        formType: "input",
                        inputType: "hidden",
                        defaultValue: model,
                        locale: locale,
                        ignoreForeign: true,
                    },
                ]}
            />
            {isForeign ? (
                <BaseForeignBlockField<TopicFormValuesType>
                    id="blocks"
                    formType="block"
                    model={model}
                    blockModel={model}
                    isConfirm={isConfirm}
                    label="ブロック"
                    blockType="information"
                    defaultValue={[]}
                    locale={locale}
                />
            ) : (
                <BaseBlockField<TopicFormValuesType>
                    id="blocks"
                    formType="block"
                    model={model}
                    blockModel={model}
                    isConfirm={isConfirm}
                    label="ブロック"
                    blockType="information"
                    defaultValue={[]}
                />
            )}
        </Box>
    );
};

export default Form;
