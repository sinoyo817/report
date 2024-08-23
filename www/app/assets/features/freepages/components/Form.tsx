import React from "react";

import { FreepageDocumentFormValuesType } from "../types";
import {
    Box,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Text,
} from "@chakra-ui/react";
import { BaseInputField } from "@/components/Form/BaseInputField";
import { BaseDatePickerField } from "@/components/Form/BaseDatePickerField";
import { BaseDatePeriodField } from "@/components/Form/BaseDatePeriodField";
import { BaseTextField } from "@/components/Form/BaseTextField";
import { BaseImageField } from "@/components/Form/BaseImageField";
import { BaseGroupField } from "@/components/Form/BaseGroupField";
import { BaseBlockField } from "@/components/Form/BaseBlockField";
import { BaseRemoteSelectField } from "@/components/Form/BaseRemoteSelectField";
import { useFreepageDocumentMeta } from "../api/getFreepageDocumentMeta";
import { DirectoryCheckbox } from "./DirectoryCheckbox";
import { useFormContext } from "react-hook-form";

type FormPropType = {
    model: string;
    isConfirm?: boolean;
    isEdit?: boolean;
};

const Form = (props: FormPropType) => {
    const { model, isConfirm = false, isEdit = false } = props;

    const { getFieldState, formState } =
        useFormContext<FreepageDocumentFormValuesType>();

    const { data: meta } = useFreepageDocumentMeta();

    const directoriesErrors = getFieldState(
        "freepage_directories",
        formState
    ).error;

    return (
        <Box mb="2">
            {meta && (
                <FormControl
                    isInvalid={directoriesErrors !== undefined}
                    isRequired={true}
                >
                    <FormLabel>
                        <Text as="span" size="xs" fontWeight="bold">
                            階層
                        </Text>
                    </FormLabel>
                    <DirectoryCheckbox<FreepageDocumentFormValuesType>
                        id={"freepage_directories"}
                        formType={"multiCheckbox"}
                        model={model}
                        isConfirm={isConfirm}
                        multipleValueOptions={Object.entries(
                            meta.master_freepage_directories
                        ).map(([key, title]) => {
                            return {
                                label: title.replaceAll("$", ""),
                                value: key,
                                depth: title.match(/\$/g)?.length || 0,
                            };
                        })}
                        formControlOptions={{
                            isInvalid: false,
                        }}
                        checkboxOptions={{
                            isRequired: false,
                        }}
                    />
                    {directoriesErrors &&
                        (directoriesErrors.types
                            ? Object.values(directoriesErrors.types).map(
                                  (err, index) => (
                                      <FormErrorMessage key={`error-${index}`}>
                                          {err}
                                      </FormErrorMessage>
                                  )
                              )
                            : directoriesErrors.message && (
                                  <FormErrorMessage>
                                      {directoriesErrors.message}
                                  </FormErrorMessage>
                              ))}
                </FormControl>
            )}

            <BaseInputField<FreepageDocumentFormValuesType>
                id="path"
                formType="input"
                model={model}
                isConfirm={isConfirm}
                label="URL"
                placeholder="URLを入力してください"
                defaultValue=""
                formControlOptions={{ isRequired: true }}
                rule={{
                    required: "URLを入力してください",
                    pattern: {
                        value: /^[a-zA-Z0-9_\-]*$/,
                        message: "ページURLの形式を確認してください",
                    },
                }}
            />

            <BaseInputField<FreepageDocumentFormValuesType>
                id="title"
                formType="input"
                model={model}
                isConfirm={isConfirm}
                label="タイトル"
                placeholder="タイトルを入力してください"
                defaultValue=""
                formControlOptions={{ isRequired: true }}
                rule={{ required: "タイトルを入力してください" }}
            />
            <BaseInputField<FreepageDocumentFormValuesType>
                id="sub_title"
                formType="input"
                model={model}
                isConfirm={isConfirm}
                label="見出し"
                placeholder="見出しを入力してください"
                defaultValue=""
            />

            <BaseDatePickerField<FreepageDocumentFormValuesType>
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
            />
            <BaseDatePeriodField<FreepageDocumentFormValuesType>
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
                        formType: "datetime",
                        defaultValue: "",
                    },
                    end: {
                        id: "end_date",
                        formType: "datetime",
                        defaultValue: "",
                    },
                }}
            />

            <BaseTextField<FreepageDocumentFormValuesType>
                id="summary"
                formType="textarea"
                model={model}
                isConfirm={isConfirm}
                label="サマリーテキスト"
                placeholder="サマリーテキストを入力してください"
            />

            <BaseGroupField<FreepageDocumentFormValuesType>
                id="metadata"
                formType="group"
                model={model}
                groupLabel="メタデータ"
                group={[
                    {
                        id: "metadata.description",
                        formType: "textarea",
                        label: "デスクリプション",
                        placeholder: "デスクリプションを入力してください",
                        defaultValue: "",
                    },
                    {
                        id: "metadata.keywords",
                        formType: "textarea",
                        label: "キーワード",
                        placeholder: "キーワードを入力してください",
                        defaultValue: "",
                    },
                    {
                        id: "metadata.file_id",
                        formType: "image",
                        label: "OGP画像(SNS投稿画像)",
                        defaultValue: "",
                    },
                    {
                        id: "metadata.model",
                        formType: "input",
                        inputType: "hidden",
                        defaultValue: model,
                    },
                ]}
            />
            <BaseBlockField<FreepageDocumentFormValuesType>
                id="blocks"
                formType="block"
                model={model}
                blockModel={model}
                isConfirm={isConfirm}
                label="ブロック"
                defaultValue={[]}
                showIgnoreWysiwygClass={true}
            />
        </Box>
    );
};

export default Form;
