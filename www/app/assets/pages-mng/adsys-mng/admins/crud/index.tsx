import React, { lazy } from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { FormProvider } from "@/providers/form";

const Create = lazy(() => import("@/features/admins/components/Create"));

function CreateIndex() {
    return (
        <FormProvider>
            <ContentLayout title="管理者">
                <Create />
            </ContentLayout>
        </FormProvider>
    );
}

export default CreateIndex;
