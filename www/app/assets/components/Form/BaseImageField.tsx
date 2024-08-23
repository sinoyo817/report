import React, { useEffect } from "react";
import { CommonFieldOptionType, FormFieldType } from "@/types";
import { Box, Input } from "@chakra-ui/react";

import { FieldValues, Path, useController, useWatch } from "react-hook-form";

import { BaseFieldWrapper } from "./BaseFieldWrapper";
import { FileBrowser } from "@/features/files/components/FileBrowser";
import { getIsForeign } from "@/utils/getIsForeign";
import { getBaseFormFieldName } from "@/utils/getBaseFormFieldName";
import { BaseConfirmView } from "../elements/Misc/BaseConfirmView";

type BaseImageFieldProps<T extends FieldValues> = FormFieldType<T> &
    CommonFieldOptionType;

export const BaseImageField = <T extends FieldValues>(
    props: BaseImageFieldProps<T>
) => {
    const {
        id,
        label,
        defaultValue,
        rule,
        inputOptions,
        formControlOptions,
        model,
        isConfirm,
        helpText,
        fileFindModel,
        ignoreFindModel,
        fileUploadOptions,
        locale,
        ignoreForeign,
        useDefaultLocaleData,
    } = props;

    const isForeign = getIsForeign({ locale });

    const fieldName = getBaseFormFieldName({
        field: `${id}`,
        isForeign: isForeign,
    }) as Path<T>;

    const {
        field: { onChange, onBlur, name, value, ref },
        fieldState,
    } = useController<T>({
        name: id,
        defaultValue: defaultValue,
        rules: rule,
    });

    const baseValue = useWatch({ name: fieldName });

    useEffect(() => {
        if (useDefaultLocaleData && isForeign && baseValue) {
            onChange(baseValue);
        }
    }, [isForeign, useDefaultLocaleData, baseValue]);

    const formBaseEl = (
        <BaseConfirmView bg="gray.200" as="div">
            <FileBrowser
                type="image"
                onChange={() => {}}
                value={baseValue}
                model={model}
                isConfirm={true}
                fileFindModel={fileFindModel}
                ignoreFindModel={ignoreFindModel}
                {...fileUploadOptions}
            />
        </BaseConfirmView>
    );

    if (isConfirm) {
        const formEl = (
            <BaseConfirmView as="div">
                <FileBrowser
                    type="image"
                    onChange={onChange}
                    value={value}
                    model={model}
                    isConfirm={isConfirm}
                    fileFindModel={fileFindModel}
                    ignoreFindModel={ignoreFindModel}
                    {...fileUploadOptions}
                />
            </BaseConfirmView>
        );
        if (isForeign) {
            return (
                <BaseFieldWrapper label={label} {...formControlOptions}>
                    {formBaseEl}

                    {!ignoreForeign && !useDefaultLocaleData && <>{formEl}</>}
                </BaseFieldWrapper>
            );
        }
        return (
            <BaseFieldWrapper label={label} {...formControlOptions}>
                <>{formEl}</>
            </BaseFieldWrapper>
        );
    }

    const formEl = (
        <>
            <FileBrowser
                type="image"
                onChange={onChange}
                value={value}
                model={model}
                maxFileSize={"5MB"}
                acceptedFileTypes={[
                    "image/jpeg",
                    "image/png",
                    "image/gif",
                    "image/svg+xml",
                ]}
                fileFindModel={fileFindModel}
                ignoreFindModel={ignoreFindModel}
                {...fileUploadOptions}
            />
            <Input
                type="hidden"
                onChange={onChange}
                name={name}
                value={value || ""}
                onBlur={onBlur}
                ref={ref}
                data-accessibility="image"
                {...inputOptions}
            />
        </>
    );

    return (
        <BaseFieldWrapper
            label={label}
            error={fieldState.error}
            helpText={helpText}
            {...formControlOptions}
        >
            {isForeign ? (
                <>
                    {formBaseEl}
                    {!ignoreForeign && (
                        <>
                            {!useDefaultLocaleData ? (
                                <>{formEl}</>
                            ) : (
                                <Input
                                    type={"hidden"}
                                    onChange={onChange}
                                    name={name}
                                    value={baseValue}
                                    onBlur={onBlur}
                                    ref={ref}
                                    isRequired={false}
                                />
                            )}
                        </>
                    )}
                </>
            ) : (
                <>{formEl}</>
            )}
        </BaseFieldWrapper>
    );
};
