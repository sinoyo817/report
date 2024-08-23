import { adminPrefix } from "@/config";
import React from "react";
import { useLocation } from "react-router-dom";

export const useContentsKey = () => {
    const location = useLocation();

    const pathname = location.pathname.replace(adminPrefix, "");

    const index = pathname.indexOf("/");

    return index === -1 ? pathname : pathname.substring(0, index);
};
