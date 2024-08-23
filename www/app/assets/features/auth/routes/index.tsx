import React from "react";
import { FormProvider } from "@/providers/form";
import { Route, Routes } from "react-router-dom";

import { Login } from "./Login";

export const AuthRoutes = () => {
    return (
        <FormProvider>
            <Routes>
                <Route path="login" element={<Login />} />
            </Routes>
        </FormProvider>
    );
};
