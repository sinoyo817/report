import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";

const Index = lazy(() => import("@/features/dead-links/components/Index"));

const Top = () => {
    return (
            <ContentLayout title="リンク切れチェック">
                <Index />
            </ContentLayout>
    );
};

export default Top;
