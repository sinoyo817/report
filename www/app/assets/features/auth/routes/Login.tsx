import React from "react";
import { Layout } from "../components/Layout";
import { LoginForm } from "../components/LoginForm";
import { FormProvider } from "@/providers/form";

export const Login = () => {
    return (
        <FormProvider>
            <Layout title="ログイン">
                <LoginForm />
            </Layout>
        </FormProvider>
    );
};
