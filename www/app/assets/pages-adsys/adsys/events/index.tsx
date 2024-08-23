import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";

const Index = lazy(() => import("@/features/events/components/Index"));

const Top = () => {
    return (
            <ContentLayout title="イベント">
                <Index />
            </ContentLayout>
    );
};

export default Top;
