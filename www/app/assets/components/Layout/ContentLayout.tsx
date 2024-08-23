import { pageTitleAtom, showLayoutAtom } from "@/stores/atom";
import { Box } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";

type ContentLayoutProps = {
    children: React.ReactNode;
    title?: string;
};

export const ContentLayout = (props: ContentLayoutProps) => {
    const { children, title } = props;
    const [, setPageTitle] = useRecoilState(pageTitleAtom);
    const [showLayout, setShowLayout] = useRecoilState(showLayoutAtom);

    useEffect(() => {
        setPageTitle(title || "");
    }, [title, setPageTitle]);

    useEffect(() => {
        if (!showLayout) {
            setShowLayout(true);
        }
    }, [showLayout, setShowLayout]);

    return <Box>{children}</Box>;
};
