import React, { lazy } from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { FormProvider } from "@/providers/form";

const Create = lazy(() => import("@/features/master-groups/components/Create"));

function CreateIndex() {
    return (
        <FormProvider>
            <ContentLayout title="グループ管理">
                <Create />
            </ContentLayout>
        </FormProvider>
    );
}

export default CreateIndex;
