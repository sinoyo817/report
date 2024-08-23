import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { FormProvider } from "@/providers/form";

const Update = React.lazy(() => import("@/features/auth/components/Update"));

function Index() {
    return (
        <FormProvider>
            <ContentLayout title="ユーザ情報">
                <Update />
            </ContentLayout>
        </FormProvider>
    );
}

export default Index;
