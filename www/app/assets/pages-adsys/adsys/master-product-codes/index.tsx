import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";

const Index = lazy(() => import("@/features/master-product-codes/components/Index"));

const Top = () => {
    return (
            <ContentLayout title="予算コード管理">
                <Index />
            </ContentLayout>
    );
};

export default Top;
