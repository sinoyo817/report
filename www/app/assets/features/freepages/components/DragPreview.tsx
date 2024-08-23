import { Badge, Box, Center, HStack, Icon, Text } from "@chakra-ui/react";
import {
    DragLayerMonitorProps,
    NodeModel,
    RenderParams,
    useDragOver,
} from "@minoru/react-dnd-treeview";
import React from "react";
import { AiFillFileText, AiFillFolder } from "react-icons/ai";
import { FreepageDirectoryType } from "../types";

export type DragPreviewType = {
    // dragSources: NodeModel<FreepageDirectoryType>[];
    monitorProps: DragLayerMonitorProps<FreepageDirectoryType>;
};

const DragPreview = (props: DragPreviewType) => {
    const { monitorProps } = props;

    const item = props.monitorProps.item;

    return (
        <Box width="md" display="block" pos="relative">
            {/* {dragSources.length > 1 && (
                <Badge
                    bg="red.300"
                    borderRadius="50%"
                    boxSize="6"
                    pos="absolute"
                    right="-2"
                    top="-2"
                    color="white"
                >
                    <Center>{dragSources.length}</Center>
                </Badge>
            )} */}
            <Box bgColor="teal.500" width="full" p="4">
                {/* {dragSources.map((item) => (
                    <HStack key={item.id} h={4} color="white" my="1">
                        {item.data && item.data.type === "directory" ? (
                            <Icon as={AiFillFolder} boxSize={4} />
                        ) : (
                            <Icon as={AiFillFileText} boxSize={4} />
                        )}
                        <Text>{item.text}</Text>
                    </HStack>
                ))} */}
                <HStack key={item.id} h={4} color="white" my="1">
                    {item.data && item.data.type === "directory" ? (
                        <Icon as={AiFillFolder} boxSize={4} />
                    ) : (
                        <Icon as={AiFillFileText} boxSize={4} />
                    )}
                    <Text>{item.text}</Text>
                </HStack>
            </Box>
        </Box>
    );
};

export default DragPreview;
