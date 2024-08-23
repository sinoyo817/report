import React, { useEffect } from "react";
import { Box, Skeleton } from "@chakra-ui/react";
import { useSettingGeneral } from "../api/getGeneral";
import { useUpdateSettingGeneral } from "../api/updateGeneral";
import { FormWithoutConfirm } from "@/components/Form/FormWithoutConfirm";
import { SettingGeneralFormValuesType } from "../types";
import { SubmitHandler, useFormContext } from "react-hook-form";
import { useSettingMeta } from "../api/getSettingsMeta";
import { BaseInputField } from "@/components/Form/BaseInputField";
import { BaseTextField } from "@/components/Form/BaseTextField";

const Index = () => {
    const query = useSettingGeneral({});

    const updateMutation = useUpdateSettingGeneral();

    const { reset } = useFormContext();

    const { data: meta } = useSettingMeta();

    useEffect(() => {
        if (query.isFetched && query.data) {
            reset(query.data);
        }
    }, [query.isFetched, query.data, reset]);

    const onSubmit: SubmitHandler<SettingGeneralFormValuesType> = async (
        values
    ) => {
        try {
            const data = await updateMutation.mutateAsync({
                data: values,
            });
        } catch (e) {
            //
        }
    };

    return (
        <FormWithoutConfirm<SettingGeneralFormValuesType>
            onSubmit={onSubmit}
            isLoading={updateMutation.isLoading}
            isEdit={true}
            isBack={false}
        >
            <Box mb="2">
                <BaseInputField<SettingGeneralFormValuesType>
                    id="site"
                    formType="input"
                    label="サイト名"
                    formControlOptions={{ isRequired: true }}
                    rule={{
                        required: "サイト名を入力してください",
                    }}
                    model={"Settings"}
                />
                <BaseTextField<SettingGeneralFormValuesType>
                    id="description"
                    formType="textarea"
                    label="デスクリプション"
                    model={"Settings"}
                />
                <BaseTextField<SettingGeneralFormValuesType>
                    id="keywords"
                    formType="textarea"
                    label="キーワード"
                    model={"Settings"}
                />
                <BaseInputField<SettingGeneralFormValuesType>
                    id="og_image"
                    formType="input"
                    label="OGP画像"
                    model={"Settings"}
                />
                <BaseInputField<SettingGeneralFormValuesType>
                    id="noimage"
                    formType="input"
                    label="NoImage"
                    model={"Settings"}
                />
                <BaseInputField<SettingGeneralFormValuesType>
                    id="locale"
                    formType="input"
                    label="言語情報"
                    model={"Settings"}
                />
                <BaseInputField<SettingGeneralFormValuesType>
                    id="og_locale"
                    formType="input"
                    label="OGP言語情報"
                    model={"Settings"}
                />
                <BaseInputField<SettingGeneralFormValuesType>
                    id="fromMail"
                    formType="input"
                    label="送信元メールアドレス"
                    formControlOptions={{ isRequired: true }}
                    rule={{
                        required: "送信元メールアドレスを入力してください",
                    }}
                    model={"Settings"}
                />
                <BaseInputField<SettingGeneralFormValuesType>
                    id="toMail"
                    formType="input"
                    label="送信先メールアドレス"
                    formControlOptions={{ isRequired: true }}
                    rule={{
                        required: "送信先メールアドレスを入力してください",
                    }}
                    model={"Settings"}
                />
                <BaseInputField<SettingGeneralFormValuesType>
                    id="fromName"
                    formType="input"
                    label="送信元タイトル"
                    formControlOptions={{ isRequired: true }}
                    rule={{
                        required: "送信元タイトルを入力してください",
                    }}
                    model={"Settings"}
                />
                <BaseInputField<SettingGeneralFormValuesType>
                    id="toName"
                    formType="input"
                    label="送信先タイトル"
                    formControlOptions={{ isRequired: true }}
                    rule={{
                        required: "送信先タイトルを入力してください",
                    }}
                    model={"Settings"}
                />
                <BaseInputField<SettingGeneralFormValuesType>
                    id="newIconLimit"
                    formType="input"
                    label="Newアイコン期限"
                    model={"Settings"}
                />
            </Box>
        </FormWithoutConfirm>
    );
};

export default Index;
