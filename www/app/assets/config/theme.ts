import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
    components: {
        Drawer: {
            variants: {
                alwaysOpen: {
                    parts: ["dialog, dialogContainer"],
                    dialog: {
                        pointerEvents: "auto",
                    },
                    dialogContainer: {
                        pointerEvents: "none",
                    },
                },
            },
        },
    },
});
