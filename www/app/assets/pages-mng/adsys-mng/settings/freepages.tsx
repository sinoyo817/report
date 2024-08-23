import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";
import { FormProvider } from "@/providers/form";

const Index = lazy(
    () => import("@/features/mng-settings/components/Freepages")
);

const Top = () => {
    return (
        <ContentLayout title="フリーページ">
            <FormProvider>
                <Index />
            </FormProvider>
        </ContentLayout>
    );
};

export default Top;
