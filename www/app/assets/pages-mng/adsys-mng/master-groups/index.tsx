import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";

const Index = lazy(() => import("@/features/master-groups/components/Index"));

const Top = () => {
    return (
        <ContentLayout title="グループ管理">
            <Index />
        </ContentLayout>
    );
};

export default Top;
