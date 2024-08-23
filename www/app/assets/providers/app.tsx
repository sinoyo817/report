import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RecoilRoot } from "recoil";

import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "@/lib/auth";
import { queryClient } from "@/lib/react-query";
import { theme } from "@/config/theme";

type AppProviderProps = {
    children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
    return (
        <React.Suspense fallback={<div>...Loading</div>}>
            <RecoilRoot>
                <QueryClientProvider client={queryClient}>
                    {process.env.NODE_ENV === "development" && (
                        <ReactQueryDevtools />
                    )}
                    {/* <Notifications /> */}
                    <AuthProvider>
                        <ChakraProvider theme={theme}>
                            {children}
                        </ChakraProvider>
                    </AuthProvider>
                </QueryClientProvider>
            </RecoilRoot>
        </React.Suspense>
    );
};
