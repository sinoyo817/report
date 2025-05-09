import React, { useEffect } from "react";
import { Button, Switch, useBoolean } from "@chakra-ui/react";
import { CommonAnswerOptions } from "@/types";

export type UseCellPropType = {
    field: keyof CommonAnswerOptions;
    onSubmit: (nextValue: keyof CommonAnswerOptions) => Promise<void>;
    confirmMessage?: string;
    confirmOffMessage?: string;
};

const UseCell = (props: UseCellPropType) => {
    const {
        field,
        onSubmit,
        confirmMessage = "工数登録に使用しますか?",
        confirmOffMessage = "工数登録から非表示にしますか?",
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

export default UseCell;
