import React, { lazy } from "react";
import { useParams } from "react-router-dom";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { FormProvider } from "@/providers/form";
import { Skeleton } from "@chakra-ui/react";

const Update = lazy(() => import("@/features/topics/components/Update"));

function UpdateIndex() {
    const { id, locale } = useParams();

    return (
        <FormProvider>
            <ContentLayout title="お知らせ">
                <Skeleton isLoaded={id !== undefined && locale !== undefined}>
                    {id && locale && <Update id={id} locale={locale} />}
                </Skeleton>
            </ContentLayout>
        </FormProvider>
    );
}

export default UpdateIndex;