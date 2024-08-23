import React, { useEffect } from "react";
import { Box, Skeleton } from "@chakra-ui/react";
import { FormWithoutConfirm } from "@/components/Form/FormWithoutConfirm";
import { SettingOptionFormValuesType } from "../types";
import { SubmitHandler, useFormContext } from "react-hook-form";
import { useSettingMeta } from "../api/getSettingsMeta";
import { BaseInputField } from "@/components/Form/BaseInputField";
import { BaseTextField } from "@/components/Form/BaseTextField";
import { useSettingOption } from "../api/getOption";
import { useUpdateSettingOption } from "../api/updateOption";
import { BaseRemoteRadioField } from "@/components/Form/BaseRemoteRadioField";
import { SettingLocaleBlockField } from "./SettingLocaleBlockField";

const Index = () => {
    const query = useSettingOption({});

    const updateMutation = useUpdateSettingOption();

    const { reset } = useFormContext();

    const { data: meta } = useSettingMeta();

    useEffect(() => {
        if (query.isFetched && query.data) {
            reset(query.data);
        }
    }, [query.isFetched, query.data, reset]);

    const onSubmit: SubmitHandler<SettingOptionFormValuesType> = async (
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
        <FormWithoutConfirm<SettingOptionFormValuesType>
            onSubmit={onSubmit}
            isLoading={updateMutation.isLoading}
            isEdit={true}
            isBack={false}
        >
            <Box mb="2">
                <Skeleton isLoaded={meta !== undefined}>
                    {meta && (
                        <BaseRemoteRadioField<SettingOptionFormValuesType>
                            id="i18n"
                            formType="remoteRadio"
                            label="多言語対応"
                            remoteDataKey="basic_display_show"
                            formControlOptions={{ isRequired: true }}
                            rule={{ required: "多言語対応を選択してください" }}
                            meta={meta}
                            model={"Settings"}
                        />
                    )}
                </Skeleton>
                <SettingLocaleBlockField<SettingOptionFormValuesType>
                    id="locale"
                    formType="block"
                    model={"Settings"}
                    blockModel={"Settings"}
                    label="言語設定"
                />
            </Box>
        </FormWithoutConfirm>
    );
};

export default Index;
