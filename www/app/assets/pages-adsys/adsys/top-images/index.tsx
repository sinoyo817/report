import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";

const Index = lazy(() => import("@/features/top-images/components/Index"));

const Top = () => {
    return (
        <ContentLayout title="TOPイメージ">
            <Index />
        </ContentLayout>
    );
};

export default Top;
