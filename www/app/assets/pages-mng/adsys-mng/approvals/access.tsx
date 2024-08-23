import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";
import { FormProvider } from "@/providers/form";

const Index = lazy(() => import("@/features/mng-approvals/components/Access"));

const Top = () => {
    return (
        <ContentLayout title="アクセス管理">
            <FormProvider>
                <Index />
            </FormProvider>
        </ContentLayout>
    );
};

export default Top;
