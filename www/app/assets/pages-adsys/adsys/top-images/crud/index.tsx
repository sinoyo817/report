import React, { lazy } from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { FormProvider } from "@/providers/form";

const Create = lazy(() => import("@/features/top-images/components/Create"));

function CreateIndex() {
    return (
        <FormProvider>
            <ContentLayout title="TOPイメージ">
                <Create />
            </ContentLayout>
        </FormProvider>
    );
}

export default CreateIndex;
