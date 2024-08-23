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
    HStack,
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
import { BulkStatus } from "@/components/elements/BulkStatus";
import { queryClient } from "@/lib/react-query";
import { useUpdateFreepageDirectorySequence } from "../api/updateFreepageDirectorySequence";

const TreeList = () => {
    const ref = useRef<TreeMethods>(null);
    const { data: meta } = useFreepageDirectoryMeta();
    const [selectedNodes, setSelectedNodes] = useState<
        NodeModel<FreepageDirectoryType>[]
    >([]);
    const mutation = useUpdateFreepageDirectorySequence();
    // const [isDragging, setIsDragging] = useState(false);
    // const [isCtrlPressing, setIsCtrlPressing] = useState(false);
    const [isDnd, setIsDnd] = useBoolean();
    // const {
    //     getContentsFilter,
    //     pageNumber,
    //     setPagination,
    //     pageLimit,
    //     setPageLimit,
    // } = useFilterParams();

    const { data, isLoading, isFetching } = useFreepageAllDirectories({});

    const tree: NodeModel<FreepageDirectoryType>[] =
        data?.data.map((i) => {
            return {
                id: i.id,
                parent: i.parent_id,
                droppable: i.type === "directory",
                text: i.title,
                data: i,
            };
        }) || [];

    // useEffect(() => {
    //     const handleKeyDown = (e: KeyboardEvent) => {
    //         if (e.key.toLowerCase() === "escape") {
    //             setSelectedNodes([]);
    //         } else if (e.ctrlKey || e.metaKey) {
    //             setIsCtrlPressing(true);
    //         }
    //     };

    //     const handleKeyUp = (e: KeyboardEvent) => {
    //         if (
    //             e.key.toLowerCase() === "control" ||
    //             e.key.toLowerCase() === "meta"
    //         ) {
    //             setIsCtrlPressing(false);
    //         }
    //     };

    //     window.addEventListener("keydown", handleKeyDown);
    //     window.addEventListener("keyup", handleKeyUp);

    //     return () => {
    //         window.removeEventListener("keydown", handleKeyDown);
    //         window.removeEventListener("keyup", handleKeyUp);
    //     };
    // }, []);

    const handleDrop = async (
        newTree: NodeModel<FreepageDirectoryType>[],
        options: DropOptions
    ) => {
        // const beforeParent = options.dragSource?.parent;
        // const afterParent = options.dropTargetId;

        const dragSource = options.dragSource;
        if (!dragSource) {
            return;
        }

        const index = tree.findIndex((item) => item.id === dragSource.id);
        // 変更なし
        if (
            index === options.destinationIndex &&
            dragSource.parent === options.dropTargetId
        ) {
            return;
        }
        // 階層が変更された場合
        // const changeParent = beforeParent !== afterParent;

        if (options.relativeIndex !== undefined) {
            const data = await mutation.mutateAsync({
                data: {
                    parent_id: options.dropTargetId as string,
                    number: options.relativeIndex,
                },
                id: dragSource.id as string,
            });
        }
    };

    // const handleOpenAll = () => ref.current?.openAll();
    // const handleCloseAll = () => ref.current?.closeAll();

    const handleSelect = (clickedNode: NodeModel<FreepageDirectoryType>) => {
        const item = selectedNodes.some((n) => n.id === clickedNode.id);

        if (!item) {
            setSelectedNodes([...selectedNodes, clickedNode]);
        } else {
            setSelectedNodes(
                selectedNodes.filter((n) => n.id !== clickedNode.id)
            );
        }
    };

    const resetSelect = () => {
        setSelectedNodes([]);
        queryClient.invalidateQueries(["freepage-all-directories"]);
    };

    const dndToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsDnd.toggle();
        setSelectedNodes([]);
    };

    const selectIds = selectedNodes.map((item) => item.id) as string[];

    return (
        <Box>
            {!isDnd && (
                <>
                    <BulkStatus
                        ids={selectIds}
                        resetRowSelection={resetSelect}
                        statusKey={"freepage-directories"}
                    />
                    <Text color="red.400" fontSize="sm">
                        ※階層を削除する際、配下の階層・ページも削除されます。
                    </Text>
                </>
            )}
            {isDnd && (
                <>
                    <Text color="red.400" fontSize="sm">
                        ※階層を並び替える際、配下の階層・ページも並び替えされます。
                    </Text>
                </>
            )}

            <Box
                bg={"white"}
                borderWidth="1px"
                boxShadow="md"
                p="5"
                mt="4"
                rounded="2xl"
                minH="96"
            >
                <HStack
                    spacing={2}
                    display="inline-flex"
                    justifyContent="right"
                    w="full"
                >
                    <Text>編集</Text>
                    <Switch
                        colorScheme="teal"
                        size="lg"
                        id="dnd"
                        onChange={dndToggle}
                        isChecked={isDnd}
                    />
                    <Text>並び替え</Text>
                </HStack>
                <DndProvider
                    backend={MultiBackend}
                    options={getBackendOptions()}
                >
                    <Box>
                        <Skeleton
                            isLoaded={!isLoading && !mutation.isLoading}
                            minH="md"
                        >
                            {data !== undefined && (
                                <Tree
                                    ref={ref}
                                    tree={tree}
                                    rootId={"root"}
                                    listComponent={List}
                                    initialOpen={true}
                                    listItemComponent={ListItem}
                                    render={(node, params) => {
                                        const selected = selectedNodes.some(
                                            (selectedNode) =>
                                                selectedNode.id === node.id
                                        );

                                        return (
                                            <TreeItem
                                                node={node}
                                                params={params}
                                                isSelected={selectedNodes.some(
                                                    (n) => n.id === node.id
                                                )}
                                                onSelect={handleSelect}
                                                // onClick={handleClick}
                                                isDnd={isDnd}
                                                meta={meta}
                                            />
                                        );
                                    }}
                                    dragPreviewRender={(monitorProps) => {
                                        return (
                                            <DragPreview
                                                // dragSources={selectedNodes}
                                                monitorProps={monitorProps}
                                            />
                                        );
                                    }}
                                    insertDroppableFirst={false}
                                    sort={false}
                                    onDrop={handleDrop}
                                    canDrag={(node) => isDnd}
                                    canDrop={(
                                        tree,
                                        { dragSource, dropTargetId, dropTarget }
                                    ) => {
                                        if (!isDnd) {
                                            return false;
                                        }
                                        if (
                                            dragSource?.parent === dropTargetId
                                        ) {
                                            return true;
                                        }
                                    }}
                                    // onDragStart={handleDragStart}
                                    // onDragEnd={handleDragEnd}
                                    dropTargetOffset={10}
                                    placeholderRender={(node, { depth }) => (
                                        <Box
                                            borderColor="blue"
                                            borderWidth="1px"
                                            style={{
                                                marginInlineStart: depth * 10,
                                            }}
                                        ></Box>
                                    )}
                                />
                            )}
                        </Skeleton>
                    </Box>
                </DndProvider>
            </Box>
        </Box>
    );
};

export default TreeList;
