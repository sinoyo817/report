import React, { lazy } from "react";
import { useParams } from "react-router-dom";
import { ContentLayout } from "@/components/Layout/ContentLayout";
import { FormProvider } from "@/providers/form";
import { Skeleton } from "@chakra-ui/react";

const UpdateDir = lazy(
    () => import("@/features/freepages/components/UpdateDir")
);

function UpdateIndex() {
    const { id } = useParams();

    return (
        <FormProvider>
            <ContentLayout title="フリーページ">
                <Skeleton isLoaded={id !== undefined}>
                    {id && <UpdateDir id={id} />}
                </Skeleton>
            </ContentLayout>
        </FormProvider>
    );
}

export default UpdateIndex;
