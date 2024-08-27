import React, { lazy } from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { FormProvider } from "@/providers/form";

const Create = lazy(() => import("@/features/day-works/components/Create"));

function CreateIndex() {
    return (
        <FormProvider>
            <ContentLayout title="工数管理">
                <Create />
            </ContentLayout>
        </FormProvider>
    );
}

export default CreateIndex;
