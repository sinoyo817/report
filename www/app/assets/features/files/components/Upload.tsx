import React, { useRef } from "react";
import { FilePond, registerPlugin } from "react-filepond";

// import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
// import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
// import FilePondPluginImageValidateSize from "filepond-plugin-image-validate-size";
// import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import "filepond/dist/filepond.min.css";
import { useCreateFile } from "../api/createFile";
import { FilePondOptions } from "filepond";

registerPlugin(
    // FilePondPluginFileEncode,
    FilePondPluginImageExifOrientation,
    FilePondPluginImageResize,
    // FilePondPluginImagePreview,
    FilePondPluginImageTransform,
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType
    // FilePondPluginImageValidateSize
);

type UploadFileProp = {
    model: string;
} & FilePondOptions;

const UploadFile = (props: UploadFileProp) => {
    const { model, ...filePondProps } = props;

    const ref = useRef<FilePond>(null);

    const mutation = useCreateFile();
    return (
        <FilePond
            ref={ref}
            allowMultiple={true}
            name="upload"
            credits={false}
            dropOnPage={true}
            server={{
                process: async (
                    fieldName,
                    file,
                    metadata,
                    load,
                    error,
                    progress,
                    abort,
                    transfer,
                    options
                ) => {
                    const formData = new FormData();
                    formData.append(fieldName, file, file.name);
                    formData.append("model", model);
                    try {
                        const data = await mutation.mutateAsync({
                            data: formData,
                        });
                        progress(true, 100, 100);
                        load("success");
                    } catch (e: any) {
                        error("failed");
                    }

                    return {
                        abort: () => {
                            abort();
                        },
                    };
                },
                revert: null,
                restore: null,
                load: null,
                fetch: null,
                remove: null,
            }}
            onprocessfile={(error, file) => {
                if (!error && ref.current) {
                    ref.current.removeFile(file);
                }
            }}
            labelTapToCancel={""}
            allowImageResize={true}
            imageResizeTargetWidth={1280}
            imageResizeTargetHeight={1280}
            imageResizeUpscale={false}
            maxParallelUploads={100}
            maxFiles={100}
            maxFileSize={"5MB"}
            labelMaxFileSizeExceeded={"最大ファイルサイズを超えました"}
            labelMaxFileSize={"最大ファイルサイズ{filesize}"}
            labelFileTypeNotAllowed={"許可されていないファイルです"}
            fileValidateTypeLabelExpectedTypes={
                "許可されているファイル {allTypes}"
            }
            fileValidateTypeLabelExpectedTypesMap={{
                "image/jpeg": ".jpg, .jpeg",
                "image/png": ".png",
                "image/gif": ".gif",
                "application/msword": ".doc,.docx",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    ".doc, .docx",
                "application/vnd.ms-excel": ".xls, .xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    ".xls, .xlsx",
                "application/vnd.ms-powerpoint": ".ppt, .pptx",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                    ".ppt, .pptx",
                "application/pdf": ".pdf",
            }}
            labelIdle="アップロードするファイルを選択またはドラッグ&ドロップしてください。"
            {...filePondProps}
        />
    );
};
export default UploadFile;
