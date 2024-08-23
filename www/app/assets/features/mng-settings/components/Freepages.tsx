import React, { useEffect } from "react";
import { Box, Skeleton } from "@chakra-ui/react";
import { useSettingFreepage } from "../api/getFreepage";
import { useUpdateSettingFreepage } from "../api/updateFreepage";
import { FormWithoutConfirm } from "@/components/Form/FormWithoutConfirm";
import { SettingFreepageFormValuesType } from "../types";
import { SubmitHandler, useFormContext } from "react-hook-form";
import { useSettingMeta } from "../api/getSettingsMeta";
import { BaseRemoteRadioField } from "@/components/Form/BaseRemoteRadioField";
import { BaseBlockField } from "@/components/Form/BaseBlockField";
import { CustomPathBlockField } from "./CustomPathBlockField";

const Index = () => {
    const query = useSettingFreepage({});

    const updateMutation = useUpdateSettingFreepage();

    const { reset } = useFormContext();

    const { data: meta } = useSettingMeta();

    useEffect(() => {
        if (query.isFetched && query.data) {
            reset(query.data);
        }
    }, [query.isFetched, query.data, reset]);

    const onSubmit: SubmitHandler<SettingFreepageFormValuesType> = async (
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
        <FormWithoutConfirm<SettingFreepageFormValuesType>
            onSubmit={onSubmit}
            isLoading={updateMutation.isLoading}
            isEdit={true}
            isBack={false}
        >
            <Box mb="2">
                <CustomPathBlockField<SettingFreepageFormValuesType>
                    id="customCss"
                    formType="block"
                    model={"Settings"}
                    blockModel={"Settings"}
                    label="カスタムCSS"
                />
                <CustomPathBlockField<SettingFreepageFormValuesType>
                    id="customJs"
                    formType="block"
                    model={"Settings"}
                    blockModel={"Settings"}
                    label="カスタムJS"
                />
                <Skeleton isLoaded={meta !== undefined}>
                    {meta && (
                        <BaseRemoteRadioField<SettingFreepageFormValuesType>
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
                <Skeleton isLoaded={meta !== undefined}>
                    {meta && (
                        <BaseRemoteRadioField<SettingFreepageFormValuesType>
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
