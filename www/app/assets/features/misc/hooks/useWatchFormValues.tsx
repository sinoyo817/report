import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

export const useWatchFormValues = () => {
    const { getValues } = useFormContext();

    return {
        ...useWatch(), // subscribe to form value updates
        ...getValues(), // always merge with latest form values
    };
};
