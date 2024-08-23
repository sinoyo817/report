import {
    Box,
    Button,
    ButtonGroup,
    Center,
    HStack,
    Heading,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import {
    FreepageDirectoryFormValuesType,
    FreepageDirectoryType,
    FreepageDirectoryMetaType,
} from "../types";
import { FormProvider } from "@/providers/form";
import { StatusCell } from "@/features/misc/components/StatusCell";
import { AddIcon } from "@chakra-ui/icons";
import { BaseForm } from "@/components/Form/BaseForm";
import { useCreateFreepageDirectory } from "../api/createFreepageDirectory";
import { SubmitHandler, useFormContext } from "react-hook-form";
import { AxiosError } from "axios";
import { ResponseValidationType } from "@/types";
import { BaseRemoteSelectField } from "@/components/Form/BaseRemoteSelectField";
import { freepageDirectoriesModel, freepagesModel } from "../api/schema";
import { BaseRemoteRadioField } from "@/components/Form/BaseRemoteRadioField";
import { BaseInputField } from "@/components/Form/BaseInputField";

export type DirectoryFormType = {
    data: FreepageDirectoryType;
    meta?: FreepageDirectoryMetaType;
    isEdit?: boolean;
};

const DirectoryForm = (props: DirectoryFormType) => {
    const { data, meta, isEdit = false } = props;

    return (
        <>
            {meta && (
                <>
                    <BaseRemoteSelectField<FreepageDirectoryFormValuesType>
                        id="parent_id"
                        formType="remoteRadio"
                        label="階層"
                        remoteDataKey="master_freepage_directories"
                        meta={meta}
                        model={freepageDirectoriesModel}
                        formControlOptions={{ isRequired: true }}
                        rule={{
                            required: "階層を選択してください",
                        }}
                        defaultValue={
                            data.type === "document" ? data.parent_id : data.id
                        }
                    />
                    {isEdit ? (
                        <>
                            <Text fontWeight="bold">タイプ</Text>
                            {meta.master_freepage_types[data.type]}
                        </>
                    ) : (
                        <BaseRemoteRadioField<FreepageDirectoryFormValuesType>
                            id="type"
                            formType="remoteRadio"
                            label="タイプ"
                            remoteDataKey="master_freepage_types"
                            meta={meta}
                            model={freepageDirectoriesModel}
                            formControlOptions={{
                                isRequired: true,
                            }}
                            rule={{
                                required: "タイプを選択してください",
                            }}
                            defaultValue="directory"
                        />
                    )}
                </>
            )}
            <BaseInputField<FreepageDirectoryFormValuesType>
                id="title"
                formType="input"
                model={freepageDirectoriesModel}
                label="タイトル"
                placeholder="タイトルを入力してください"
                defaultValue=""
                formControlOptions={{ isRequired: true }}
                rule={{ required: "タイトルを入力してください" }}
            />
            <BaseInputField<FreepageDirectoryFormValuesType>
                id="path"
                formType="input"
                model={freepageDirectoriesModel}
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
        </>
    );
};

export default DirectoryForm;
