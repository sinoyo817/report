import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";

const Index = lazy(() => import("@/features/admins/components/Index"));

const Top = () => {
    return (
        <ContentLayout title="管理者">
            <Index />
        </ContentLayout>
    );
};

export default Top;
