import React from "react";
import { AppProvider } from "@/providers/app";

import { RouterProvider } from "react-router-dom";

import { PublicRoutes } from "./routes/publicRoute";

function App() {
    return (
        <AppProvider>
            <RouterProvider router={PublicRoutes()} />
        </AppProvider>
    );
}

export default App;
