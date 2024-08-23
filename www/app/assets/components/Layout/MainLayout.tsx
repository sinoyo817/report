import React from "react";
import { Box, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/lib/auth";

type MainLayoutProps = {
    children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
    const drawerDisclosure = useDisclosure();
    const sideBarDisclosure = useDisclosure({ defaultIsOpen: true });
    const { user } = useAuth();

    const hamburgerClick = useBreakpointValue(
        {
            base: drawerDisclosure.onOpen,
            xl: sideBarDisclosure.onToggle,
        },
        {
            ssr: false,
        }
    );

    return (
        <Box as="section" bg="gray.50" color="black" _dark={{ bg: "gray.700" }} minH="100vh">
            <Sidebar
                drawerDisclosure={drawerDisclosure}
                sideBarDisclosure={sideBarDisclosure}
                nav={user.data?.meta.routes}
            />
            <Box
                ml={{ base: 0, xl: sideBarDisclosure.isOpen ? 60 : 0 }}
                transition=".3s ease"
            >
                <Header hamburgerClick={hamburgerClick} user={user} />

                <Box as="main" p="4">
                    {children}
                </Box>
            </Box>
        </Box>
    );
};
