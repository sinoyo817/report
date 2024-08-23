import { FileType } from "@/features/files";
import { FileBrowser } from "@/features/files/components/FileBrowser";
import { MetaUtilityType } from "@/types";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import {
    ButtonGroup,
    Center,
    IconButton,
    Select,
    SimpleGrid,
    useBoolean,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FileTumb } from "../File/FileThum";
import { ImageTumb } from "../File/ImageThum";

export type EditableFileCellPropType = {
    field: string;
    file?: FileType;
    model: string;
    type?: "file" | "image";
    onSubmit: (nextValue: string) => Promise<void>;
};

export const EditableFileCell = (props: EditableFileCellPropType) => {
    const { field, model, onSubmit, file, type = "image" } = props;
    const [isEditing, setIsEditing] = useBoolean();
    const [value, setValue] = useState<string>(field);
    const [current, setCurrent] = useState<FileType | undefined>(file);

    return isEditing ? (
        <>
            <Center>
                <FileBrowser
                    type={type}
                    onChange={setValue}
                    value={value}
                    model={model}
                    thumBoxWrapProps={{ boxSize: "150px" }}
                    thumBoxProps={{ minH: "100px", minW: "100px" }}
                    tumbImageProps={{ boxSize: "100px" }}
                />
            </Center>
            <ButtonGroup justifyContent="center" size="sm" mx="2">
                <IconButton
                    aria-label="check"
                    icon={<CheckIcon />}
                    onClick={async (e) => {
                        await onSubmit(value);
                        setIsEditing.off();
                    }}
                />
                <IconButton
                    aria-label="close"
                    icon={<CloseIcon />}
                    onClick={(e) => {
                        setValue(field);
                        setIsEditing.off();
                    }}
                />
            </ButtonGroup>
        </>
    ) : (
        <>
            {current &&
                (current.mime.includes("image/") ? (
                    <ImageTumb
                        filePath={current.fileCmsPath}
                        filename={current.filename}
                        isCaption={true}
                        tumbBoxProps={{ minH: "100px", minW: "100px" }}
                        tumbImageProps={{ boxSize: "100px" }}
                    />
                ) : (
                    <FileTumb
                        isCaption={true}
                        filePath={current.fileCmsPath}
                        filename={current.filename}
                        mime={current.mime}
                    />
                ))}
            <IconButton
                aria-label="edit"
                size="sm"
                icon={<EditIcon />}
                onClick={setIsEditing.on}
            />
        </>
    );
};
