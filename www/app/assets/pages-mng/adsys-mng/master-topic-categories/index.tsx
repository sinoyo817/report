import React from "react";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { lazy } from "react";

const Index = lazy(
    () => import("@/features/master-topic-categories/components/Index")
);

const Top = () => {
    return (
        <ContentLayout title="お知らせカテゴリ">
            <Index />
        </ContentLayout>
    );
};

export default Top;
