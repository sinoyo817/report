import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";

const Index = lazy(() => import("@/features/mng-assets/components/Index"));

const Top = () => {
    return (
            <ContentLayout title="アセット">
                <Index />
            </ContentLayout>
    );
};

export default Top;
