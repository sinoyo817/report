import { Button, HStack, IconButton, Link, useDisclosure, Collapse, } from "@chakra-ui/react";
import React from "react";
import { FreepageDirectoryType, FreepageDirectoryMetaType } from "../types";
import { FormProvider } from "@/providers/form";
import { StatusCell } from "@/features/misc/components/StatusCell";
import AddDirectory from "./AddDirectory";
import { adminPrefix } from "@/config";
import EditDirectory from "./EditDirectory";
import { Link as RouterLink } from "react-router-dom";
import InfoDirectory from "./InfoDirectory";
import { EditIcon, ViewIcon, AddIcon, MinusIcon ,SmallAddIcon } from "@chakra-ui/icons";


export type MenuItemType = {
    data: FreepageDirectoryType;
    meta?: FreepageDirectoryMetaType;
};

const MenuItem = (props: MenuItemType) => {
    const { data, meta } = props;

    const isRoot = data.parent_id === "root";
    const { isOpen, onToggle } = useDisclosure();
    
    return (
        <HStack>
            {!isRoot && data.type === "document" && data.freepage_document ? (
                <StatusCell
                    status={data.freepage_document?.status}
                    w="16"
                    m={0}
                    pb={1}
                />
            ) : (
                <StatusCell status={data.public} w="16" m={0} pb={1} />
            )}
            <IconButton
                aria-label={isOpen ? "閉じる" : "開く"}
                icon={isOpen ? <MinusIcon /> : <AddIcon />}
                onClick={onToggle}
                bg="gray.100"
                p={2}
                boxSize={7}
                minWidth={0}
                fontSize={'.7em'}
                borderRadius={'50%'}
            >
            </IconButton>
            <Collapse in={isOpen} animateOpacity>
            <HStack
                p={0.5}
                spacing={0}
                bg="teal.50"
                borderRadius={10}
                // opacity={0}
                // _hover={{ bg: "teal.50", borderRadius: 10, opacity: 1 }}
            >
                {!isRoot && <InfoDirectory {...props} />}

                {data.type === "directory" && (
                    // <FormProvider>
                    //     <AddDirectory {...props} />
                    // </FormProvider>
                    <>
                        <AddDirectory {...props} />
                        {!isRoot && (
                            <FormProvider>
                                <EditDirectory {...props} />
                            </FormProvider>
                        )}
                    </>
                )}
                {data.type === "document" && (
                    <>
                        {!isRoot && (
                            <IconButton
                                icon={<EditIcon boxSize={4} />}
                                aria-label="ページ編集"
                                as={RouterLink}
                                to={`crud/${data.freepage_document_id}`}
                                title="ページ編集"
                                boxSize={6}
                                variant="ghost"
                            >
                                ページ編集
                            </IconButton>
                        )}
                        {!isRoot && (
                            <IconButton
                                icon={<ViewIcon boxSize={4} />}
                                aria-label="ページプレビュー"
                                as={Link}
                                target={"_blank"}
                                href={`${adminPrefix}api/freepage-documents/preview/${data.freepage_document_id}`}
                                title="ページプレビュー"
                                boxSize={6}
                                variant="ghost"
                            >
                                プレビュー
                            </IconButton>
                        )}
                    </>
                )}
            </HStack>
            </Collapse>

        </HStack>
    );
};

export default MenuItem;
