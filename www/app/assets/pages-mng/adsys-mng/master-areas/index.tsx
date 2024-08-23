import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";

const Index = lazy(() => import("@/features/master-areas/components/Index"));

const Top = () => {
    return (
        <ContentLayout title="エリア">
            <Index />
        </ContentLayout>
    );
};

export default Top;
