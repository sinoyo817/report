import {
    NodeModel,
    RenderParams,
    useDragOver,
} from "@minoru/react-dnd-treeview";
import {
    Box,
    Checkbox,
    HStack,
    Icon,
    List,
    ListItem,
    Text,
} from "@chakra-ui/react";
import { AiFillFileText, AiFillFolder, AiFillFolderOpen } from "react-icons/ai";
import React from "react";
import { DragHandleIcon } from "@chakra-ui/icons";
import { FreepageDirectoryType, FreepageDirectoryMetaType } from "../types";
import MenuItem from "./MenuItem";

export type TreeItemType = {
    node: NodeModel<FreepageDirectoryType>;
    params: RenderParams;
    isSelected: boolean;
    isDragging?: boolean;
    onSelect: (node: NodeModel<FreepageDirectoryType>) => void;
    // onClick: (
    //     e: React.MouseEvent,
    //     node: NodeModel<FreepageDirectoryType>
    // ) => void;
    isDnd: boolean;
    meta?: FreepageDirectoryMetaType;
};

const TreeItem = (props: TreeItemType) => {
    const {
        node,
        params,
        isSelected,
        onSelect,
        // onClick,
        isDragging = false,
        isDnd = false,
        meta,
    } = props;
    const indent = params.depth * 10;

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        params.onToggle();
    };

    const dragOverProps = useDragOver(node.id, params.isOpen, params.onToggle);

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSelect(node);
    };

    // const handleClick = (e: React.MouseEvent) => {
    //     if (isDnd) {
    //         onClick(e, node);
    //     }
    // };

    const isRoot = node.parent === "root";

    return (
        <Box
            py="1"
            mb="1"
            bg={isSelected ? "teal.400" : ""}
            color={isSelected ? "white" : ""}
            style={{ marginInlineStart: indent }}
            opacity={isDragging ? "0.5" : "1"}
            display="grid"
            {...dragOverProps}
        >
            <HStack spacing="1">
                {!isRoot && !isDnd && (
                    <Checkbox
                        colorScheme="blue"
                        isChecked={isSelected}
                        onChange={handleSelect}
                        mr="2"
                        px="2"
                    />
                )}
                {!isRoot && isDnd && (
                    <DragHandleIcon
                        // onClick={handleClick}
                        mr="2"
                        cursor="pointer"
                    />
                )}
                {node.data && node.data.type === "directory" && (
                    <HStack h="6" onClick={handleToggle} cursor="pointer">
                        {params.isOpen ? (
                            <Icon as={AiFillFolderOpen} boxSize={6} />
                        ) : (
                            <Icon as={AiFillFolder} boxSize={6} />
                        )}

                        <Text>{node.text}</Text>
                    </HStack>
                )}
                {node.data && node.data.type === "document" && (
                    <HStack h="6">
                        <Icon as={AiFillFileText} boxSize={6} />
                        <Text>{node.text}</Text>
                    </HStack>
                )}

                {!isDnd && node.data && (
                    <MenuItem data={node.data} meta={meta} />
                )}
            </HStack>
        </Box>
    );
};

export default TreeItem;
