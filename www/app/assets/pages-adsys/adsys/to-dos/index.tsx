import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";

const Index = lazy(() => import("@/features/to-dos/components/Index"));

const Top = () => {
    return (
            <ContentLayout title="対応したいことリスト">
                <Index />
            </ContentLayout>
    );
};

export default Top;
