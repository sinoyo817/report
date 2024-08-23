import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";

const Index = lazy(() => import("@/features/master-event-categories/components/Index"));

const Top = () => {
    return (
            <ContentLayout title="イベントカテゴリ">
                <Index />
            </ContentLayout>
    );
};

export default Top;
