import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";

const Index = lazy(() => import("@/features/day-works/components/Index"));

const Top = () => {
    return (
            <ContentLayout title="工数管理">
                <Index />
            </ContentLayout>
    );
};

export default Top;
