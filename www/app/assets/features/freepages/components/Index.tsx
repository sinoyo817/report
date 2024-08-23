import {
    DndProvider,
    DropOptions,
    MultiBackend,
    NodeModel,
    Tree,
    TreeMethods,
    getBackendOptions,
    isAncestor,
} from "@minoru/react-dnd-treeview";
import React, { useEffect, useRef, useState } from "react";
import { FreepageDirectoryType } from "../types";
import {
    Box,
    Button,
    ButtonGroup,
    Divider,
    HStack,
    Icon,
    IconButton,
    List,
    ListItem,
    Skeleton,
    Switch,
    Text,
    useBoolean,
} from "@chakra-ui/react";
import { AiFillFileText, AiFillFolder, AiFillFolderOpen } from "react-icons/ai";
import TreeItem from "./TreeItem";
import DragPreview from "./DragPreview";
import { useFreepageAllDirectories } from "../api/getFreepageAllDirectories";
import { useFilterParams } from "@/features/misc/hooks/useFilterParams";
import { useFreepageDirectoryMeta } from "../api/getFreepageDirectoryMeta";
import { StringUtilityType } from "@/types";
import { useRecoilState } from "recoil";
import { freepageShowStateAtom } from "@/stores/atom";
import Table from "./Table";
import TreeList from "./TreeList";
import { CgListTree } from "react-icons/cg";
import { IoIosListBox } from "react-icons/io";

const Index = () => {
    const [type, setType] = useRecoilState(freepageShowStateAtom);

    const handleClick = () => {
        setType(type === "table" ? "tree" : "table");
    };

    return (
        <Box>
            <Box display="inline-flex" justifyContent="right" w="full">
                <IconButton
                    icon={
                        type === "table" ? (
                            <Icon as={CgListTree} boxSize={6} />
                        ) : (
                            <Icon as={IoIosListBox} boxSize={6} />
                        )
                    }
                    onClick={handleClick}
                    aria-label={
                        type === "table"
                            ? "ツリー表示へ切り替え"
                            : "テーブル表示へ切り替え"
                    }
                    boxSize={8}
                    // pos="absolute"
                    right="0"
                    mr="2"
                    title={
                        type === "table"
                            ? "ツリー表示へ切り替え"
                            : "テーブル表示へ切り替え"
                    }
                    colorScheme="teal"
                />
            </Box>
            {type === "table" && <Table />}
            {type === "tree" && <TreeList />}
        </Box>
    );
};

export default Index;
