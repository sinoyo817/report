import React from "react";

import {
    Box,
    BoxProps,
    Drawer,
    DrawerContent,
    DrawerOverlay,
    Flex,
    Hide,
    Link,
    Text,
    UseDisclosureReturn,
} from "@chakra-ui/react";
import { Link as RouterLink, NavLink } from "react-router-dom";

import { ReactComponent as MainLogo } from "@/assets/adsys/img/qtmedia-logo.svg";
import { SideNavigationItemType } from "@/features/auth";

const Logo = (props: { onClose?: () => void }) => {
    const { onClose } = props;
    return (
        <Link as={RouterLink} to={"."} display={"block"} onClick={onClose}>
            <Box as={MainLogo} w={"full"} height={"8"} display={"block"} />
        </Link>
    );
};

type SideNavigationProps = BoxProps & {
    nav?: SideNavigationItemType[];
    onClose?: () => void;
};

const SideNavigation = (props: SideNavigationProps) => {
    const { nav, onClose, ...boxProps } = props;
    return (
        <Box
            as="nav"
            pos="fixed"
            top="0"
            left="0"
            zIndex="sticky"
            h="full"
            pb="10"
            overflowX="hidden"
            overflowY="auto"
            bg="cyan.800"
            _dark={{ bg: "gray.800" }}
            color="inherit"
            borderRightWidth="1px"
            w="60"
            {...boxProps}
        >
            <Flex px="4" py="5" align="center">
                <Logo onClose={onClose} />
            </Flex>
            <Flex
                direction="column"
                as="nav"
                fontSize="sm"
                color="gray.600"
                aria-label="Main Navigation"
            >
                {nav &&
                    nav.map((item, index) => (
                        <Box key={"navigation-" + index} pb={3}>
                            {item.title && (
                                <Text
                                    w={"full"}
                                    py="3"
                                    fontWeight={"bold"}
                                    fontSize={"xs"}
                                    color={"cyan.100"}
                                    bg={"cyan.900"}
                                    letterSpacing={"wider"}
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                    pl={4}
                                >
                                    {item.title}
                                </Text>
                            )}
                            {item.links.map((navItem, navIndex) => (
                                <Flex
                                    align="center"
                                    px="4"
                                    pl="6"
                                    py="3"
                                    cursor="pointer"
                                    color="white"
                                    _dark={{ color: "gray.400" }}
                                    _hover={{
                                        bg: "cyan.700",
                                        _dark: { bg: "gray.900" },
                                        color: "white",
                                    }}
                                    role={"navigation"}
                                    fontWeight="semibold"
                                    key={navItem.key}
                                    as={NavLink}
                                    to={navItem.to}
                                    _activeLink={{
                                        fontWeight: "semibold",
                                        bg: "gray.100",
                                        color: "gray.900",
                                    }}
                                    onClick={onClose}
                                >
                                    <span>{navItem.name}</span>
                                </Flex>
                            ))}
                        </Box>
                    ))}
            </Flex>
        </Box>
    );
};

type SideBarProps = {
    drawerDisclosure: UseDisclosureReturn;
    sideBarDisclosure: UseDisclosureReturn;
    nav?: SideNavigationItemType[];
};

export const Sidebar = (props: SideBarProps) => {
    const { drawerDisclosure, sideBarDisclosure, nav } = props;

    return (
        <Box>
            {/* <Hide below="md"> */}
            <SideNavigation
                nav={nav}
                visibility={{
                    base: "hidden",
                    xl: sideBarDisclosure.isOpen ? "unset" : "hidden",
                }}
                opacity={{
                    base: 0,
                    xl: sideBarDisclosure.isOpen ? 1 : 0,
                }}
                transition={sideBarDisclosure.isOpen ? "1.0s ease" : ".3s ease"}
            />
            {/* </Hide> */}
            <Drawer
                isOpen={drawerDisclosure.isOpen}
                onClose={drawerDisclosure.onClose}
                placement="left"
            >
                <DrawerOverlay />
                <DrawerContent>
                    <SideNavigation
                        nav={nav}
                        onClose={drawerDisclosure.onClose}
                        w="full"
                        borderRight="none"
                    />
                </DrawerContent>
            </Drawer>
        </Box>
    );
};
