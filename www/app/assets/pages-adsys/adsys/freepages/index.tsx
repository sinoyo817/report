import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";

const Index = lazy(() => import("@/features/freepages/components/Index"));

const Top = () => {
    return (
            <ContentLayout title="フリーページ">
                <Index />
            </ContentLayout>
    );
};

export default Top;
