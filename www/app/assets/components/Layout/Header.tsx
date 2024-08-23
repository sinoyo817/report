import React from "react";
import {
    Avatar,
    Box,
    Flex,
    Heading,
    IconButton,
    Link,
    LinkBox,
    LinkOverlay,
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { UseQueryResult } from "@tanstack/react-query";
import { AuthType } from "@/features/auth";
import { useRecoilValue } from "recoil";
import { pageTitleAtom } from "@/stores/atom";
import { Link as RouterLink } from "react-router-dom";
import { adminPrefix } from "@/config";

type HeaderProps = {
    user: UseQueryResult<AuthType | null, Error>;
    hamburgerClick: (() => void) | (() => void) | undefined;
};

export const Header = (props: HeaderProps) => {
    const { user, hamburgerClick } = props;

    const title = useRecoilValue(pageTitleAtom);

    return (
        <Flex
            as="header"
            align="center"
            justify="space-between"
            w="full"
            px="4"
            bg="white"
            _dark={{ bg: "gray.800" }}
            borderBottomWidth="1px"
            color="cyan.800"
            h="14"
        >
            <IconButton
                aria-label="Menu"
                display="inline-flex"
                onClick={hamburgerClick}
                icon={<HamburgerIcon />}
                size="sm"
                variant="outline"
            />
            <Box w={"100%"} display="flex">
                <Heading
                    ml="4"
                    justifyContent="center"
                    flexDirection="column"
                    alignItems="center"
                    fontSize={"2xl"}
                >
                    {title}
                </Heading>
            </Box>
            <Flex alignItems={"center"}>
                <Menu>
                    <Avatar as={MenuButton} ml="4" size="sm" cursor="pointer" />
                    <MenuList>
                        <MenuGroup title={user.data?.title}>
                            <MenuItem
                                as={RouterLink}
                                to={`${adminPrefix}auth/password`}
                            >
                                パスワード変更
                            </MenuItem>
                        </MenuGroup>
                        <MenuDivider />

                        <MenuItem
                            as={Link}
                            href={`${adminPrefix}admins/logout`}
                        >
                            ログアウト
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        </Flex>
    );
};
