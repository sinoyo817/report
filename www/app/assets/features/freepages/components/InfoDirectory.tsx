import {
    Box,
    Button,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    Portal,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import React from "react";
import { FreepageDirectoryType, FreepageDirectoryMetaType } from "../types";
import { InfoIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { StatusCell } from "@/features/misc/components/StatusCell";
import { DatePeriodCell } from "@/features/misc/components/DatePeriodCell";

export type InfoDirectoryType = {
    data: FreepageDirectoryType;
    meta?: FreepageDirectoryMetaType;
};

const InfoDirectory = (props: InfoDirectoryType) => {
    const { data, meta } = props;

    return (
        <Popover>
            <PopoverTrigger>
                <IconButton
                    icon={<InfoOutlineIcon boxSize={4} />}
                    aria-label={"情報"}
                    boxSize={6}
                    title="情報"
                    variant="ghost"
                />
            </PopoverTrigger>
            <Portal>
                <PopoverContent w="md">
                    <PopoverArrow />
                    <PopoverHeader h="8" borderWidth={0}></PopoverHeader>
                    <PopoverCloseButton />
                    <PopoverBody>
                        <TableContainer>
                            <Table>
                                <Tbody>
                                    <Tr>
                                        <Th bg="teal.100" w="4">
                                            ID
                                        </Th>
                                        <Td>{data.cid}</Td>
                                    </Tr>
                                    <Tr>
                                        <Th bg="teal.100" w="4">
                                            最終更新者
                                        </Th>
                                        <Td>{data.modified_admin?.title}</Td>
                                    </Tr>
                                    <Tr>
                                        <Th bg="teal.100" w="4">
                                            最終更新日時
                                        </Th>
                                        <Td>{data.modified}</Td>
                                    </Tr>
                                    {data.type === "document" && (
                                        <>
                                            <Tr>
                                                <Th bg="teal.100" w="4">
                                                    公開日
                                                </Th>
                                                <Td>{data.published}</Td>
                                            </Tr>
                                            <Tr>
                                                <Th bg="teal.100" w="4">
                                                    公開期間
                                                </Th>
                                                <Td>
                                                    <DatePeriodCell
                                                        startDate={
                                                            data
                                                                .freepage_document
                                                                ?.start_date
                                                        }
                                                        endDate={
                                                            data
                                                                .freepage_document
                                                                ?.end_date
                                                        }
                                                    />
                                                </Td>
                                            </Tr>
                                            <Tr>
                                                <Th bg="teal.100" w="4">
                                                    ステータス
                                                </Th>
                                                <Td>
                                                    <StatusCell
                                                        status={data.status}
                                                    />
                                                </Td>
                                            </Tr>
                                        </>
                                    )}

                                    <Tr>
                                        <Th bg="teal.100" w="4">
                                            作成者
                                        </Th>
                                        <Td>{data.create_admin?.title}</Td>
                                    </Tr>
                                    <Tr>
                                        <Th bg="teal.100" w="4">
                                            作成日時
                                        </Th>
                                        <Td>{data.created}</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </PopoverBody>
                </PopoverContent>
            </Portal>
        </Popover>
    );
};

export default InfoDirectory;
