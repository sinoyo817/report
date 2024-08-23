import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";

const Index = lazy(() => import("@/features/mng-resets/components/Index"));

const Top = () => {
    return (
            <ContentLayout title="データリセット">
                <Index />
            </ContentLayout>
    );
};

export default Top;
