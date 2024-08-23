import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";

const Index = lazy(() => import("@/features/bunners/components/Index"));

const Top = () => {
    return (
            <ContentLayout title="バナー">
                <Index />
            </ContentLayout>
    );
};

export default Top;
