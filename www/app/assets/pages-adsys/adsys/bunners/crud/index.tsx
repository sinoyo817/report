import React, { lazy } from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { FormProvider } from "@/providers/form";

const Create = lazy(() => import("@/features/bunners/components/Create"));

function CreateIndex() {
    return (
        <FormProvider>
            <ContentLayout title="バナー">
                <Create />
            </ContentLayout>
        </FormProvider>
    );
}

export default CreateIndex;
