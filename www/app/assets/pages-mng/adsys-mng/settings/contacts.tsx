import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";
import { FormProvider } from "@/providers/form";

const Index = lazy(() => import("@/features/mng-settings/components/Contacts"));

const Top = () => {
    return (
        <ContentLayout title="お問い合わせ">
            <FormProvider>
                <Index />
            </FormProvider>
        </ContentLayout>
    );
};

export default Top;
