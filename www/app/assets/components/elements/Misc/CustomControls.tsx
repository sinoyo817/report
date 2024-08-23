import React from "react";
import { ButtonGroup, IconButton, useEditableControls } from "@chakra-ui/react";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";

export const EditableControls = () => {
    const {
        isEditing,
        getSubmitButtonProps,
        getCancelButtonProps,
        getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
        <ButtonGroup justifyContent="center" size="sm" mx="2">
            <IconButton
                aria-label="check"
                icon={<CheckIcon />}
                {...getSubmitButtonProps()}
            />
            <IconButton
                aria-label="close"
                icon={<CloseIcon />}
                {...getCancelButtonProps()}
            />
        </ButtonGroup>
    ) : (
        <IconButton
            aria-label="edit"
            size="sm"
            icon={<EditIcon />}
            {...getEditButtonProps()}
        />
    );
};
