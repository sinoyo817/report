import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";

const Index = lazy(
    () => import("@/features/master-contact-categories/components/Index")
);

const Top = () => {
    return (
        <ContentLayout title="お問い合わせカテゴリ">
            <Index />
        </ContentLayout>
    );
};

export default Top;
