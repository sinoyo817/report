import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";

const Index = lazy(() => import("@/features/master-work-codes/components/Index"));

const Top = () => {
    return (
            <ContentLayout title="作業内容管理">
                <Index />
            </ContentLayout>
    );
};

export default Top;
