import { CkeditorFileBrowser } from "@/features/files/components/CkeditorFileBrowser";
import { FormProvider } from "@/providers/form";
import { showLayoutAtom } from "@/stores/atom";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useRecoilState } from "recoil";

const Index = () => {
    const [, setShowLayout] = useRecoilState(showLayoutAtom);
    useEffect(() => {
        setShowLayout(false);
    }, [setShowLayout]);
    return <CkeditorFileBrowser />;
};

export default Index;
