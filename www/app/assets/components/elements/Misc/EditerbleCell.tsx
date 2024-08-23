import React from "react";
import {
    Editable,
    EditableInput,
    EditablePreview,
    EditableTextarea,
} from "@chakra-ui/react";
import { EditableControls } from "./CustomControls";

export type EditableCellPropType = {
    field: string;
    onSubmit: (nextValue: string) => Promise<void>;
    type?: "input" | "textarea";
};

export const EditableCell = (props: EditableCellPropType) => {
    const { field, onSubmit, type = "input" } = props;

    return (
        <Editable
            textAlign="center"
            onSubmit={onSubmit}
            defaultValue={field}
            fontSize="2xl"
            submitOnBlur={false}
            isPreviewFocusable={false}
        >
            {type === "input" ? (
                <>
                    <EditablePreview fontSize="md" />
                    <EditableInput fontSize="md" />
                </>
            ) : (
                <>
                    <EditablePreview fontSize="md" whiteSpace="pre-wrap" />
                    <EditableTextarea fontSize="md" rows={4} />
                </>
            )}
            <EditableControls />
        </Editable>
    );
};
