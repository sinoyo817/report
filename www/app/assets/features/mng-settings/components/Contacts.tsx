import React, { useEffect } from "react";
import { Box, Skeleton } from "@chakra-ui/react";
import { useSettingContact } from "../api/getContact";
import { useUpdateSettingContact } from "../api/updateContact";
import { FormWithoutConfirm } from "@/components/Form/FormWithoutConfirm";
import { SettingContactFormValuesType } from "../types";
import { SubmitHandler, useFormContext } from "react-hook-form";
import { AxiosError } from "axios";
import { useSettingMeta } from "../api/getSettingsMeta";
import { BaseRemoteRadioField } from "@/components/Form/BaseRemoteRadioField";
import { BaseCheckboxField } from "@/components/Form/BaseCheckboxField";
import { BaseRadioField } from "@/components/Form/BaseRadioField";
import { BaseInputField } from "@/components/Form/BaseInputField";

const Index = () => {
    const query = useSettingContact({});

    const updateMutation = useUpdateSettingContact();

    const { reset } = useFormContext();

    const { data: meta } = useSettingMeta();

    useEffect(() => {
        if (query.isFetched && query.data) {
            reset(query.data);
        }
    }, [query.isFetched, query.data, reset]);

    const onSubmit: SubmitHandler<SettingContactFormValuesType> = async (
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
        <FormWithoutConfirm<SettingContactFormValuesType>
            onSubmit={onSubmit}
            isLoading={updateMutation.isLoading}
            isEdit={true}
            isBack={false}
        >
            <Box mb="2">
                <Skeleton isLoaded={meta !== undefined}>
                    {meta && (
                        <BaseRemoteRadioField<SettingContactFormValuesType>
                            id="title"
                            formType="remoteRadio"
                            label="名前表示"
                            remoteDataKey="basic_display_show"
                            formControlOptions={{ isRequired: true }}
                            rule={{ required: "名前表示を選択してください" }}
                            meta={meta}
                            model={"Settings"}
                        />
                    )}
                </Skeleton>
                <Skeleton isLoaded={meta !== undefined}>
                    {meta && (
                        <BaseRemoteRadioField<SettingContactFormValuesType>
                            id="email"
                            formType="remoteRadio"
                            label="メールアドレス表示"
                            remoteDataKey="basic_display_show"
                            formControlOptions={{ isRequired: true }}
                            rule={{
                                required:
                                    "メールアドレス表示を選択してください",
                            }}
                            meta={meta}
                            model={"Settings"}
                        />
                    )}
                </Skeleton>
                <Skeleton isLoaded={meta !== undefined}>
                    {meta && (
                        <BaseRemoteRadioField<SettingContactFormValuesType>
                            id="address"
                            formType="remoteRadio"
                            label="住所表示"
                            remoteDataKey="basic_display_show"
                            formControlOptions={{ isRequired: true }}
                            rule={{
                                required: "住所表示を選択してください",
                            }}
                            meta={meta}
                            model={"Settings"}
                        />
                    )}
                </Skeleton>
                <Skeleton isLoaded={meta !== undefined}>
                    {meta && (
                        <BaseRemoteRadioField<SettingContactFormValuesType>
                            id="tel"
                            formType="remoteRadio"
                            label="電話番号表示"
                            remoteDataKey="basic_display_show"
                            formControlOptions={{ isRequired: true }}
                            rule={{
                                required: "電話番号表示を選択してください",
                            }}
                            meta={meta}
                            model={"Settings"}
                        />
                    )}
                </Skeleton>
                <Skeleton isLoaded={meta !== undefined}>
                    {meta && (
                        <BaseRemoteRadioField<SettingContactFormValuesType>
                            id="gender"
                            formType="remoteRadio"
                            label="性別表示"
                            remoteDataKey="basic_display_show"
                            formControlOptions={{ isRequired: true }}
                            rule={{
                                required: "性別表示を選択してください",
                            }}
                            meta={meta}
                            model={"Settings"}
                        />
                    )}
                </Skeleton>
                <Skeleton isLoaded={meta !== undefined}>
                    {meta && (
                        <BaseRemoteRadioField<SettingContactFormValuesType>
                            id="birthday"
                            formType="remoteRadio"
                            label="生年月日表示"
                            remoteDataKey="basic_display_show"
                            formControlOptions={{ isRequired: true }}
                            rule={{
                                required: "生年月日表示を選択してください",
                            }}
                            meta={meta}
                            model={"Settings"}
                        />
                    )}
                </Skeleton>
                <Skeleton isLoaded={meta !== undefined}>
                    {meta && (
                        <BaseRemoteRadioField<SettingContactFormValuesType>
                            id="genre"
                            formType="remoteRadio"
                            label="ジャンル表示"
                            remoteDataKey="basic_display_show"
                            formControlOptions={{ isRequired: true }}
                            rule={{
                                required: "ジャンル表示を選択してください",
                            }}
                            meta={meta}
                            model={"Settings"}
                        />
                    )}
                </Skeleton>
                <Skeleton isLoaded={meta !== undefined}>
                    {meta && (
                        <BaseRemoteRadioField<SettingContactFormValuesType>
                            id="file"
                            formType="remoteRadio"
                            label="添付表示"
                            remoteDataKey="basic_display_show"
                            formControlOptions={{ isRequired: true }}
                            rule={{
                                required: "添付表示を選択してください",
                            }}
                            meta={meta}
                            model={"Settings"}
                        />
                    )}
                </Skeleton>
                <Skeleton isLoaded={meta !== undefined}>
                    {meta && (
                        <BaseRemoteRadioField<SettingContactFormValuesType>
                            id="summary"
                            formType="remoteRadio"
                            label="お問い合わせ表示"
                            remoteDataKey="basic_display_show"
                            formControlOptions={{ isRequired: true }}
                            rule={{
                                required: "お問い合わせ表示を選択してください",
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
