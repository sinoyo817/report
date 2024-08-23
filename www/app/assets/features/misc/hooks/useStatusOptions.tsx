import React from "react";
import { useAuth } from "@/lib/auth";
import { useContentsKey } from "./useContentsKey";

export type useStatusOptionsPropType = {
    forSearch?: boolean;
    statusKey?: string;
};

export const useStatusOptions = (props: useStatusOptionsPropType = {}) => {
    const { forSearch = false, statusKey } = props;
    const contentsKey = useContentsKey();
    const {
        user: { data },
    } = useAuth();

    if (!data) {
        return;
    }

    if (statusKey && data.meta.statusOptions[statusKey]) {
        if (forSearch) {
            return data.meta.statusOptions[statusKey].filter(
                (item) => item.forSearch
            );
        }

        return data.meta.statusOptions[statusKey].filter(
            (item) => item.forSelect
        );
    }

    if (data.meta.statusOptions[contentsKey]) {
        if (forSearch) {
            return data.meta.statusOptions[contentsKey].filter(
                (item) => item.forSearch
            );
        }

        return data.meta.statusOptions[contentsKey].filter(
            (item) => item.forSelect
        );
    }

    if (forSearch) {
        return data.meta.statusOptions.default.filter((item) => item.forSearch);
    }

    return data.meta.statusOptions.default.filter((item) => item.forSelect);
};
