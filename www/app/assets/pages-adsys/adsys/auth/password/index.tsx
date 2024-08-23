import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { FormProvider } from "@/providers/form";

const UpdatePassword = React.lazy(
    () => import("@/features/auth/components/UpdatePassword")
);

function Index() {
    return (
        <FormProvider>
            <ContentLayout title="パスワード変更">
                <UpdatePassword />
            </ContentLayout>
        </FormProvider>
    );
}

export default Index;
