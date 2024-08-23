import React, { useEffect, useState } from "react";
import { useFile } from "@/features/files/api/getFile";
import { Box, BoxProps, ImageProps } from "@chakra-ui/react";
import { ImageTumb } from "./ImageThum";
import { FileTumb } from "./FileThum";
import { FileType } from "@/features/files";

type TumbProp = {
    value: string;
    thumBoxWrapProps?: BoxProps;
    thumBoxProps?: BoxProps;
    tumbImageProps?: ImageProps;
    current?: FileType;
    setCurrent: React.Dispatch<React.SetStateAction<FileType | undefined>>;
};

export const Tumb = (props: TumbProp) => {
    const {
        value,
        thumBoxWrapProps,
        thumBoxProps,
        tumbImageProps,
        current,
        setCurrent,
    } = props;
    const { data: file } = useFile({ id: value });

    useEffect(() => {
        if (file) {
            setCurrent(file);
        } else {
            setCurrent(undefined);
        }
    }, [file]);

    if (current === undefined) {
        return <></>;
    }

    return (
        <Box w="200px" display="block" {...thumBoxWrapProps}>
            {current.mime.includes("image/") ? (
                <ImageTumb
                    filePath={current.fileCmsPath}
                    filename={current.filename}
                    isCaption={true}
                    tumbBoxProps={thumBoxProps}
                    tumbImageProps={tumbImageProps}
                />
            ) : (
                <FileTumb
                    isCaption={true}
                    filePath={current.fileCmsPath}
                    filename={current.filename}
                    mime={current.mime}
                />
            )}
        </Box>
    );
};
