import React from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Suspense } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { showLayoutAtom } from "@/stores/atom";
import { useRecoilState } from "recoil";
import { Skeleton } from "@chakra-ui/react";

const App = () => {
    const [showLayout] = useRecoilState(showLayoutAtom);

    return showLayout ? (
        <MainLayout>
            <Suspense fallback={<Skeleton h="full" />}>
                <Outlet />
                <ScrollRestoration
                    getKey={(location, matches) => {
                        // default behavior
                        return location.key;
                    }}
                />
            </Suspense>
        </MainLayout>
    ) : (
        <Suspense fallback={<Skeleton h="full" />}>
            <Outlet />
            <ScrollRestoration
                getKey={(location, matches) => {
                    // default behavior
                    return location.key;
                }}
            />
        </Suspense>
    );
};

export default App;
