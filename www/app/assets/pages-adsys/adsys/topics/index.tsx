import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";

const Index = lazy(() => import("@/features/topics/components/Index"));

const Top = () => {
    return (
        <ContentLayout title="お知らせ">
            <Index />
        </ContentLayout>
    );
};

export default Top;
