import React, { lazy } from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { FormProvider } from "@/providers/form";

const Create = lazy(() => import("@/features/topics/components/Create"));

function CreateIndex() {
    return (
        <FormProvider>
            <ContentLayout title="お知らせ">
                <Create />
            </ContentLayout>
        </FormProvider>
    );
}

export default CreateIndex;
