import React, { useEffect } from "react";
import {
    FieldValues,
    Path,
    useController,
    useFormContext,
    useWatch,
} from "react-hook-form";
import { useMemo, useState } from "react";

import { BaseFieldWrapper } from "./BaseFieldWrapper";
import { CommonFieldOptionType, FormFieldType } from "@/types";
import { CKEditor, CKEditorInstance, useCKEditor } from "ckeditor4-react";
import { ckeditorTypeConfig } from "@/config/ckeditor";
import { adminPrefix, subDir } from "@/config";
import { Input, Skeleton, Text, Textarea } from "@chakra-ui/react";
import { useFiles } from "@/features/files/api/getFiles";
import { Interweave } from "interweave";
import "@/assets/adsys/css/wysiwyg.css";
import { FileFilterParamType } from "@/features/files";
import { BaseConfirmView } from "../elements/Misc/BaseConfirmView";
import { getBaseFormFieldName } from "@/utils/getBaseFormFieldName";
import { getIsForeign } from "@/utils/getIsForeign";

type BaseDatePickerFieldProps<T extends FieldValues> = FormFieldType<T> &
    CommonFieldOptionType & {
        fileFieldName: Path<T>;
    };

export const BaseCkeditorField = <T extends FieldValues>(
    props: BaseDatePickerFieldProps<T>
) => {
    const {
        id,
        formType = "text",
        label,
        placeholder,
        defaultValue,
        rule,
        formControlOptions,
        model,
        isConfirm,
        fileFieldName,
        helpText,
        locale,
        ignoreForeign,
        useDefaultLocaleData,
    } = props;

    const isForeign = getIsForeign({ locale });

    const fieldName = getBaseFormFieldName({
        field: `${id}`,
        isForeign: isForeign,
    }) as Path<T>;

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const {
        field: { onChange, onBlur, name, value, ref },
        fieldState,
    } = useController<T>({
        name: id,
        defaultValue: defaultValue,
        rules: rule,
    });

    const baseFileFieldName = getBaseFormFieldName({
        field: `${fileFieldName}`,
        isForeign: isForeign,
    }) as Path<T>;

    const { field: fileField, fieldState: fileFieldState } = useController<T>({
        name: fileFieldName,
        defaultValue: "" as any,
    });

    const baseValue = useWatch({ name: fieldName });
    const baseFileFieldValue = useWatch({ name: baseFileFieldName });

    const { getValues } = useFormContext();

    const initData = defaultValue || getValues(id);

    useEffect(() => {
        if (useDefaultLocaleData && isForeign && baseValue) {
            onChange(baseValue);
        }
        if (useDefaultLocaleData && isForeign && baseFileFieldValue) {
            fileField.onChange(baseFileFieldValue);
        }
    }, [isForeign, useDefaultLocaleData, baseValue]);

    useEffect(() => {
        if (value) {
            let paths: string[] = [];
            const dom = new DOMParser().parseFromString(value, "text/html");
            const images = dom.querySelectorAll(
                `img[src^="${subDir ? `/${subDir}` : ""}/files/"]`
            );
            if (images.length > 0) {
                for (const image of images) {
                    const url = new URL((image as HTMLImageElement).src);

                    paths = [...paths, url.pathname];
                }
            }
            const links = dom.querySelectorAll(
                `a[href^="${subDir ? `/${subDir}` : ""}/files/"]`
            );
            if (links.length > 0) {
                for (const link of links) {
                    const url = new URL((link as HTMLLinkElement).href);
                    paths = [...paths, url.pathname];
                }
            }
            if (paths.length > 0) {
                fileField.onChange(paths.toString());
            }
        } else {
            fileField.onChange("");
        }
    }, [value, fileField]);

    const formBaseEl = (
        <BaseConfirmView
            as="div"
            className="wysiwyg"
            mb="0"
            bg="gray.200"
            h="60"
            overflowY="scroll"
        >
            <Interweave content={baseValue} noWrap />
        </BaseConfirmView>
    );

    if (isConfirm) {
        const formEl = (
            <BaseConfirmView as="div" className="wysiwyg" minH="20" h="auto">
                <Interweave content={value} noWrap />
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
                {formEl}
            </BaseFieldWrapper>
        );
    }

    const formEl = (
        <>
            <Textarea
                placeholder={placeholder}
                onChange={onChange}
                name={name}
                value={value}
                onBlur={onBlur}
                ref={ref}
                visibility="hidden"
                display="none"
                data-accessibility="wysiwyg"
                required={false}
            />
            <CKEditor
                name={id as string}
                key={id as string}
                onChange={(e) => {
                    onChange(e.editor.getData());
                }}
                onInstanceReady={({ editor }) => {
                    editor.setData(initData);
                    setIsLoading(false);
                }}
                onBeforeCommandExec={(event) => {
                    if (
                        event?.data?.name == "superscript" &&
                        event.editor.commands.subscript.state == 1
                    ) {
                        event.editor.execCommand("subscript");
                    } else if (
                        event?.data?.name == "subscript" &&
                        event.editor.commands.superscript.state == 1
                    ) {
                        event.editor.execCommand("superscript");
                    }
                }}
                onBeforeLoad={(CKEDITOR) => {
                    CKEDITOR.on("dialogDefinition", (ev: any) => {
                        const dialogName = ev.data.name;
                        const dialogDefinition = ev.data.definition;

                        if (dialogName == "templates") {
                            const infoTab =
                                dialogDefinition.getContents("selectTpl");
                            infoTab.get("chkInsertOpt")["default"] = "";
                        }

                        if (
                            dialogName == "table" ||
                            dialogName == "tableProperties"
                        ) {
                            dialogDefinition.removeContents("advanced");

                            // Get a reference to the 'Table Info' tab.
                            const infoTab =
                                dialogDefinition.getContents("info");

                            const textWidth = infoTab.get("txtWidth");
                            textWidth["default"] = "100%";
                            //infoTab.remove( 'txtWidth');
                            infoTab.remove("txtHeight");
                            infoTab.remove("txtSummary");
                            //infoTab.remove( 'txtCaption');
                            infoTab.remove("cmbAlign");
                            infoTab.remove("txtBorder");
                            //infoTab.remove( 'selHeaders');
                            infoTab.remove("txtCellSpace");
                            infoTab.remove("txtCellPad");
                        }

                        // 画像のダイアログコンテンツから、任意のメニュータブを削除する
                        if (
                            dialogName == "image" ||
                            dialogName == "imageProperties"
                        ) {
                            dialogDefinition.removeContents("advanced");
                            dialogDefinition.removeContents("Link");
                            dialogDefinition.removeContents("Upload");
                        }

                        // リンクのダイアログコンテンツから、任意のメニュータブを削除する
                        if (
                            dialogName == "link" ||
                            dialogName == "linkProperties"
                        ) {
                            dialogDefinition.removeContents("advanced");
                            dialogDefinition.removeContents("upload");
                        }
                    });
                }}
                initData={initData || undefined}
                config={{
                    ...ckeditorTypeConfig,
                    ...{
                        filebrowserBrowseUrl: `${adminPrefix}files/browser?type=file&model=${model}`,
                        filebrowserImageBrowseUrl: `${adminPrefix}files/browser?type=image&model=${model}`,
                    },
                }}
                editorUrl={`${adminPrefix}res/Ckeditor/ckeditor.js`}
            />
            <Input
                type="hidden"
                name={fileField.name}
                value={fileField.value}
                onBlur={fileField.onBlur}
                ref={fileField.ref}
            />
        </>
    );

    const isLoaded =
        !isForeign || (isForeign && !ignoreForeign && !useDefaultLocaleData);

    return (
        <>
            <Skeleton isLoaded={isLoaded ? !isLoading : true} minH="40">
                <BaseFieldWrapper
                    label={label}
                    error={fieldState.error}
                    visibility={isLoading ? "hidden" : "visible"}
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
                                        <>
                                            <Input
                                                type={"hidden"}
                                                placeholder={placeholder}
                                                onChange={onChange}
                                                name={name}
                                                value={baseValue}
                                                onBlur={onBlur}
                                                ref={ref}
                                                isRequired={false}
                                            />
                                            <Input
                                                type={"hidden"}
                                                placeholder={placeholder}
                                                onChange={onChange}
                                                name={name}
                                                value={baseFileFieldValue}
                                                onBlur={onBlur}
                                                ref={ref}
                                                isRequired={false}
                                            />
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <>{formEl}</>
                    )}
                </BaseFieldWrapper>
            </Skeleton>
        </>
    );
};
