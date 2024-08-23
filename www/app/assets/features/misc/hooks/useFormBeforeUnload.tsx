import React, { useEffect } from "react";
import { useFormState } from "react-hook-form";

export const useFormBeforeUnload = () => {
    const formstate = useFormState();
    const isDirty = Object.keys(formstate.touchedFields).length > 0;

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (
                isDirty &&
                event.target instanceof Element &&
                event.target.closest('a:not([target="_blank"]')
            ) {
                if (
                    !window.confirm(
                        "行った変更が保存されない可能性があります。"
                    )
                ) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        };
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isDirty) {
                event.preventDefault();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("click", handleClick, true);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("click", handleClick, true);
        };
    }, [isDirty]);
};
