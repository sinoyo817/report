import React from "react";
import { lazyImport } from "@/utils/lazyimport";
import { RouteObject, createBrowserRouter } from "react-router-dom";
import { adminPrefix } from "@/config";

import { AuthRoutes } from "@/features/auth";

const publicRouteObject: RouteObject[] = [
    {
        path: `${adminPrefix}admins/*`,
        element: <AuthRoutes />,
    },
    {
        path: `*`,
        element: <div>...Loading</div>,
    },
];

export const PublicRoutes = () => {
    const route = createBrowserRouter(publicRouteObject);

    return route;
};
