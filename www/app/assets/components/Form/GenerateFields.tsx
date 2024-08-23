import React from "react";
import {
    CommonFieldOptionType,
    FormFieldType,
    MetaUtilityType,
    UnkownUtilityType,
} from "@/types";
import { lazyImport } from "@/utils/lazyimport";
import { Box, Stack } from "@chakra-ui/react";
import { FieldValues } from "react-hook-form";

const { BaseDatePickerField } = lazyImport(
    () => import("./BaseDatePickerField"),
    "BaseDatePickerField"
);

const { BaseDatePeriodField } = lazyImport(
    () => import("./BaseDatePeriodField"),
    "BaseDatePeriodField"
);

const { BaseInputField } = lazyImport(
    () => import("./BaseInputField"),
    "BaseInputField"
);

const { BaseCkeditorField } = lazyImport(
    () => import("./BaseCkeditorField"),
    "BaseCkeditorField"
);

const { BaseBlockField } = lazyImport(
    () => import("./BaseBlockField"),
    "BaseBlockField"
);

const { BaseTextField } = lazyImport(
    () => import("./BaseTextField"),
    "BaseTextField"
);

const { BaseCheckboxField } = lazyImport(
    () => import("./BaseCheckboxField"),
    "BaseCheckboxField"
);

const { BaseMultiCheckboxField } = lazyImport(
    () => import("./BaseMultiCheckboxField"),
    "BaseMultiCheckboxField"
);

const { BaseRadioField } = lazyImport(
    () => import("./BaseRadioField"),
    "BaseRadioField"
);

const { BaseSelectField } = lazyImport(
    () => import("./BaseSelectField"),
    "BaseSelectField"
);

const { BaseImageField } = lazyImport(
    () => import("./BaseImageField"),
    "BaseImageField"
);

const { BaseFileField } = lazyImport(
    () => import("./BaseFileField"),
    "BaseFileField"
);

const { BaseGroupField } = lazyImport(
    () => import("./BaseGroupField"),
    "BaseGroupField"
);

const { BasePasswordConfirmField } = lazyImport(
    () => import("./BasePasswordConfirmField"),
    "BasePasswordConfirmField"
);

const { BaseTimePickerField } = lazyImport(
    () => import("./BaseTimePickerField"),
    "BaseTimePickerField"
);

const { BaseRemoteMultiCheckboxField } = lazyImport(
    () => import("./BaseRemoteMultiCheckboxField"),
    "BaseRemoteMultiCheckboxField"
);
const { BaseRemoteRadioField } = lazyImport(
    () => import("./BaseRemoteRadioField"),
    "BaseRemoteRadioField"
);
const { BaseRemoteSelectField } = lazyImport(
    () => import("./BaseRemoteSelectField"),
    "BaseRemoteSelectField"
);

const { BaseSimpleBlockField } = lazyImport(
    () => import("./BaseSimpleBlockField"),
    "BaseSimpleBlockField"
);

type GenerateFieldsProps<T extends FieldValues> = CommonFieldOptionType & {
    fields: FormFieldType<T>[];
    meta?: MetaUtilityType;
};

export const GenerateFields = <T extends FieldValues = FieldValues>(
    props: GenerateFieldsProps<T>
) => {
    const { fields, isConfirm, model, meta, locale } = props;

    const elements = fields.map((data) => {
        const prop = { ...data, isConfirm, model, locale };
        const element = (() => {
            switch (data?.formType) {
                case "input":
                    return <BaseInputField<T> {...prop} />;
                case "checkbox":
                    return <BaseCheckboxField<T> {...prop} />;
                case "multiCheckbox":
                    return <BaseMultiCheckboxField<T> {...prop} />;
                case "radio":
                    return <BaseRadioField<T> {...prop} />;
                case "select":
                    return <BaseSelectField<T> {...prop} />;
                case "date":
                case "datetime":
                    return <BaseDatePickerField<T> {...prop} />;
                case "time":
                    return <BaseTimePickerField<T> {...prop} />;
                case "datePeriod": {
                    const { periodGroup, ...other } = prop;
                    if (periodGroup) {
                        return (
                            <BaseDatePeriodField<T>
                                {...other}
                                periodGroup={periodGroup}
                            />
                        );
                    } else {
                        return <></>;
                    }
                }
                case "wysiwyg": {
                    const { wysiwygFilesField, ...other } = prop;
                    if (wysiwygFilesField) {
                        return (
                            <BaseCkeditorField<T>
                                fileFieldName={wysiwygFilesField}
                                {...other}
                            />
                        );
                    } else {
                        return <></>;
                    }
                }
                case "textarea":
                    return <BaseTextField<T> {...prop} />;
                case "image":
                    return <BaseImageField<T> {...prop} />;
                case "file":
                    return <BaseFileField<T> {...prop} />;
                case "group":
                    return <BaseGroupField<T> {...prop} />;
                case "block":
                    return <BaseBlockField<T> {...prop} />;
                case "simpleBlock":
                    return <BaseSimpleBlockField<T> {...prop} />;
                case "passwordConfirm":
                    return <BasePasswordConfirmField<T> {...prop} />;
                case "remoteMultiCheckbox":
                    if (meta) {
                        return (
                            <BaseRemoteMultiCheckboxField<T>
                                {...prop}
                                meta={meta}
                            />
                        );
                    } else {
                        return <></>;
                    }
                case "remoteRadio":
                    if (meta) {
                        return (
                            <BaseRemoteRadioField<T> {...prop} meta={meta} />
                        );
                    } else {
                        return <></>;
                    }
                case "remoteSelect":
                    if (meta) {
                        return (
                            <BaseRemoteSelectField<T> {...prop} meta={meta} />
                        );
                    } else {
                        return <></>;
                    }
                default:
                    return <></>;
            }
        })();

        if (!element) {
            return <></>;
        }

        return (
            <Box key={data.id}>
                <Stack>{element}</Stack>
            </Box>
        );
    });

    return elements;
};
