import React from "react";
import { AppProvider } from "@/providers/app";

import { lazyImport } from "./utils/lazyimport";

import { ProtectedRoutes } from "./routes/protectedRoute";
import { RouterProvider } from "react-router-dom";

function App() {
    return (
        <AppProvider>
            <RouterProvider router={ProtectedRoutes()} />
        </AppProvider>
    );
}

export default App;
