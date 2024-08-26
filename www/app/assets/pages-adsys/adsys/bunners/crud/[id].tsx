import React, { lazy } from "react";
import { useParams } from "react-router-dom";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { FormProvider } from "@/providers/form";
import { Skeleton } from "@chakra-ui/react";

const Update = lazy(() => import("@/features/bunners/components/Update"));

function UpdateIndex() {
    const { id } = useParams();

    return (
        <FormProvider>
            <ContentLayout title="バナー">
                <Skeleton isLoaded={id !== undefined}>
                    {id && <Update id={id} />}
                </Skeleton>
            </ContentLayout>
        </FormProvider>
    );
}

export default UpdateIndex;