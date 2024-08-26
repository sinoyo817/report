import React, { useEffect } from "react";
import { Box, Skeleton } from "@chakra-ui/react";
import { useSettingTopic } from "../api/getTopic";
import { useUpdateSettingTopic } from "../api/updateTopic";
import { FormWithoutConfirm } from "@/components/Form/FormWithoutConfirm";
import { SettingTopicFormValuesType } from "../types";
import { SubmitHandler, useFormContext } from "react-hook-form";
import { AxiosError } from "axios";
import { useSettingMeta } from "../api/getSettingsMeta";
import { BaseRemoteRadioField } from "@/components/Form/BaseRemoteRadioField";
import { BaseCheckboxField } from "@/components/Form/BaseCheckboxField";
import { BaseRadioField } from "@/components/Form/BaseRadioField";
import { BaseInputField } from "@/components/Form/BaseInputField";

const Index = () => {
    const query = useSettingTopic({});

    const updateMutation = useUpdateSettingTopic();

    const { reset } = useFormContext();

    const { data: meta } = useSettingMeta();

    useEffect(() => {
        if (query.isFetched && query.data) {
            reset(query.data);
        }
    }, [query.isFetched, query.data, reset]);

    const onSubmit: SubmitHandler<SettingTopicFormValuesType> = async (
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
        <FormWithoutConfirm<SettingTopicFormValuesType>
            onSubmit={onSubmit}
            isLoading={updateMutation.isLoading}
            isEdit={true}
            isBack={false}
        >
            <Box mb="2">
                <Skeleton isLoaded={meta !== undefined}>
                    {meta && (
                        <BaseRemoteRadioField<SettingTopicFormValuesType>
                            id="category"
                            formType="remoteRadio"
                            label="カテゴリ"
                            remoteDataKey="master_category_use"
                            formControlOptions={{ isRequired: true }}
                            rule={{ required: "カテゴリを選択してください" }}
                            meta={meta}
                            model={"Settings"}
                        />
                    )}
                </Skeleton>
                <Skeleton isLoaded={meta !== undefined}>
                    {meta && (
                        <BaseRemoteRadioField<SettingTopicFormValuesType>
                            id="thumbnail"
                            formType="remoteRadio"
                            label="サムネイル表示"
                            remoteDataKey="basic_display_show"
                            formControlOptions={{ isRequired: true }}
                            rule={{
                                required: "サムネイル表示を選択してください",
                            }}
                            meta={meta}
                            model={"Settings"}
                        />
                    )}
                </Skeleton>
                <Skeleton isLoaded={meta !== undefined}>
                    {meta && (
                        <BaseRemoteRadioField<SettingTopicFormValuesType>
                            id="summary"
                            formType="remoteRadio"
                            label="概要文表示"
                            remoteDataKey="basic_display_show"
                            formControlOptions={{ isRequired: true }}
                            rule={{
                                required: "概要文表示を選択してください",
                            }}
                            meta={meta}
                            model={"Settings"}
                        />
                    )}
                </Skeleton>
                <Skeleton isLoaded={meta !== undefined}>
                    {meta && (
                        <BaseRemoteRadioField<SettingTopicFormValuesType>
                            id="accesibility"
                            formType="remoteRadio"
                            label="アクセシビリティチェック機能"
                            remoteDataKey="basic_display_show"
                            formControlOptions={{ isRequired: true }}
                            rule={{
                                required:
                                    "アクセシビリティチェック機能を選択してください",
                            }}
                            meta={meta}
                            model={"Settings"}
                        />
                    )}
                </Skeleton>
                <BaseInputField<SettingTopicFormValuesType>
                    id="paging"
                    formType="input"
                    inputType="number"
                    label="ページング件数"
                    formControlOptions={{ isRequired: true }}
                    rule={{
                        required: "ページング件数を入力してください",
                    }}
                    model={"Settings"}
                />
                <Skeleton isLoaded={meta !== undefined}>
                    {meta && (
                        <BaseRemoteRadioField<SettingTopicFormValuesType>
                            id="approve"
                            formType="remoteRadio"
                            label="承認機能"
                            remoteDataKey="basic_display_show"
                            formControlOptions={{ isRequired: true }}
                            rule={{
                                required: "承認機能を選択してください",
                            }}
                            meta={meta}
                            model={"Settings"}
                        />
                    )}
                </Skeleton>
            </Box>
        </FormWithoutConfirm>
    );
};

export default Index;