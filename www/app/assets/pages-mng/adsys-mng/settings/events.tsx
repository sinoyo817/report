import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";
import { FormProvider } from "@/providers/form";

const Index = lazy(() => import("@/features/mng-settings/components/Events"));

const Top = () => {
    return (
        <ContentLayout title="イベント">
            <FormProvider>
                <Index />
            </FormProvider>
        </ContentLayout>
    );
};

export default Top;
