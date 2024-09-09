import React, { lazy } from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { FormProvider } from "@/providers/form";

const Create = lazy(() => import("@/features/to-dos/components/Create"));

function CreateIndex() {
    return (
        <FormProvider>
            <ContentLayout title="対応したいことリスト">
                <Create />
            </ContentLayout>
        </FormProvider>
    );
}

export default CreateIndex;
