import React, { useState } from "react";
import { Box, Skeleton, useBoolean } from "@chakra-ui/react";

type PreviewIframeProp = {
    html: string;
};

export const PreviewIframe = (props: PreviewIframeProp) => {
    const { html } = props;

    const [height, setHeight] = useState(0);
    const [isLoading, setIsLoading] = useBoolean(true);

    return (
        <Skeleton isLoaded={!isLoading} minH="600px">
            <Box w="100%" h="100%">
                <Box
                    as={"iframe"}
                    srcDoc={html}
                    onLoad={(
                        e: React.SyntheticEvent<HTMLIFrameElement, Event>
                    ) => {
                        //
                        const document = e.currentTarget.contentDocument;
                        const height = document?.body.scrollHeight;
                        if (height !== undefined) {
                            const offsetHeight = height;
                            setHeight(offsetHeight);
                            setIsLoading.off();
                        }
                        e.currentTarget.contentWindow?.addEventListener(
                            "resize",
                            () => {
                                const height = document?.body.scrollHeight;
                                if (height !== undefined) {
                                    const offsetHeight = height;
                                    setHeight(offsetHeight);
                                }
                            }
                        );
                    }}
                    h={height}
                    w="100%"
                    overflow="hidden"
                    border="0px"
                    // position="fixed"
                    visibility={isLoading ? "hidden" : "visible"}
                />
            </Box>
        </Skeleton>
    );
};
