import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";
import { FormProvider } from "@/providers/form";

const Index = lazy(() => import("@/features/mng-settings/components/General"));

const Top = () => {
    return (
        <ContentLayout title="全般">
            <FormProvider>
                <Index />
            </FormProvider>
        </ContentLayout>
    );
};

export default Top;
