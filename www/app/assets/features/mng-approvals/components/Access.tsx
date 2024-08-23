import React, { useEffect } from "react";
import { Badge, Box, Heading, SimpleGrid } from "@chakra-ui/react";
import { useApprovalMeta } from "../api/getApprovalsMeta";
import { FormWithoutConfirm } from "@/components/Form/FormWithoutConfirm";
import { ApprovalAccessFormValuesType } from "../types";
import { SubmitHandler, useFormContext } from "react-hook-form";
import { useUpdateApprovalAccess } from "../api/updateAccess";
import { useApprovalAccess } from "../api/getAccess";
import { BaseRemoteSelectField } from "@/components/Form/BaseRemoteSelectField";
import { BaseCheckboxField } from "@/components/Form/BaseCheckboxField";
import { BaseRemoteRadioField } from "@/components/Form/BaseRemoteRadioField";

const Access = () => {
    const query = useApprovalAccess({});

    const { reset } = useFormContext();

    const { data: meta } = useApprovalMeta();

    useEffect(() => {
        if (query.isFetched && query.data) {
            reset(query.data);
        }
    }, [query.isFetched, query.data, reset]);

    const updateMutation = useUpdateApprovalAccess();

    const onSubmit: SubmitHandler<ApprovalAccessFormValuesType> = async (
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

    if (!meta) {
        return <></>;
    }

    return (
        <FormWithoutConfirm<ApprovalAccessFormValuesType>
            onSubmit={onSubmit}
            isLoading={updateMutation.isLoading}
            isEdit={true}
            isBack={false}
        >
            {Object.entries(meta.all_roles).map(([roleKey, roleTitle]) => (
                <Box key={roleKey} mb="2">
                    <Badge colorScheme="red" fontSize="xl">
                        {roleTitle}
                    </Badge>
                    <BaseRemoteSelectField<ApprovalAccessFormValuesType>
                        id={`${roleKey}.defaultStatusOption`}
                        formType={"remoteSelect"}
                        label="デフォルトのステータスオプション"
                        remoteDataKey="all_status_options"
                        formControlOptions={{ isRequired: true }}
                        rule={{
                            required:
                                "デフォルトステータスオプションを選択してください",
                        }}
                        placeholder="--"
                        meta={meta}
                        model={"Approvals"}
                    />
                    <Box my="2">
                        {Object.entries(meta.all_contents).map(
                            ([contentsKey, contentsTitle]) => (
                                <Box mb="2" key={contentsKey}>
                                    <Badge colorScheme="green" fontSize="lg">
                                        {contentsTitle}
                                    </Badge>
                                    <SimpleGrid columns={2} w="96">
                                        <BaseRemoteRadioField<ApprovalAccessFormValuesType>
                                            id={`${roleKey}.${contentsKey}.enabled`}
                                            formType="remoteRadio"
                                            label="アクセス許可"
                                            remoteDataKey="basic_display_show"
                                            formControlOptions={{
                                                isRequired: true,
                                            }}
                                            rule={{
                                                required:
                                                    "アクセス許可を選択してください",
                                            }}
                                            meta={meta}
                                            model={"Approvals"}
                                        />
                                        <BaseRemoteSelectField<ApprovalAccessFormValuesType>
                                            id={`${roleKey}.${contentsKey}.options`}
                                            formType={"remoteSelect"}
                                            label="ステータスオプション"
                                            remoteDataKey="all_status_options"
                                            placeholder="デフォルトを利用"
                                            meta={meta}
                                            model={"Approvals"}
                                        />
                                    </SimpleGrid>
                                </Box>
                            )
                        )}
                    </Box>
                </Box>
            ))}
        </FormWithoutConfirm>
    );
};

export default Access;
