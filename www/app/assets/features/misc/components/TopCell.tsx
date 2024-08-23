import React, { useEffect } from "react";
import { Button, Switch, useBoolean } from "@chakra-ui/react";
import { CommonAnswerOptions } from "@/types";

export type TopCellPropType = {
    field: keyof CommonAnswerOptions;
    onSubmit: (nextValue: keyof CommonAnswerOptions) => Promise<void>;
    confirmMessage?: string;
    confirmOffMessage?: string;
};

const TopCell = (props: TopCellPropType) => {
    const {
        field,
        onSubmit,
        confirmMessage = "TOPに表示しますか?",
        confirmOffMessage = "TOPから非表示にしますか?",
    } = props;
    const [checked, isChecked] = useBoolean(field === "yes");

    return (
        <Switch
            isChecked={checked}
            onChange={async (e) => {
                if (
                    confirm(
                        e.target.checked ? confirmMessage : confirmOffMessage
                    )
                ) {
                    isChecked.toggle();
                    await onSubmit(e.target.checked ? "yes" : "no");
                }
            }}
        />
    );
};

export default TopCell;
