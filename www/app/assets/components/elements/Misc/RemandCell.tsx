import React from "react";
import {
    Badge,
    BadgeProps,
    Button,
    ButtonGroup,
    Center,
    Heading,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { ApprovalRemandType } from "@/types";
export type ApprovalRemandCellPropType = {
    approval_remands?: ApprovalRemandType[];
};

const RemandCell = (props: ApprovalRemandCellPropType) => {
    const { approval_remands } = props;

    const { isOpen, onOpen, onClose } = useDisclosure();

    if (approval_remands && approval_remands.length > 0) {
        //
        return (
            <>
                <IconButton
                    aria-label="modal"
                    icon={<ExternalLinkIcon />}
                    onClick={onOpen}
                />
                <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>
                            <Center>
                                <Heading>差戻し履歴</Heading>
                            </Center>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <TableContainer>
                                <Table>
                                    <Thead>
                                        <Th bg="cyan.100" textAlign="center">
                                            内容
                                        </Th>
                                        <Th bg="cyan.100" textAlign="center">
                                            管理者
                                        </Th>
                                        <Th bg="cyan.100" textAlign="center">
                                            日時
                                        </Th>
                                    </Thead>
                                    <Tbody>
                                        {approval_remands.map((item) => {
                                            return (
                                                <Tr key={item.id}>
                                                    <Td
                                                        textAlign="center"
                                                        whiteSpace="pre-wrap"
                                                    >
                                                        {item.summary}
                                                    </Td>
                                                    <Td textAlign="center">
                                                        {
                                                            item.create_admin
                                                                .title
                                                        }
                                                    </Td>
                                                    <Td textAlign="center">
                                                        {item.created}
                                                    </Td>
                                                </Tr>
                                            );
                                        })}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </ModalBody>
                        <ModalFooter>
                            <ButtonGroup variant="outline" spacing="6">
                                <Button
                                    type="button"
                                    size="lg"
                                    bg={"gray.400"}
                                    color={"white"}
                                    _hover={{
                                        bg: "blue.500",
                                    }}
                                    onClick={onClose}
                                >
                                    閉じる
                                </Button>
                            </ButtonGroup>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        );
    } else {
        return <>-</>;
    }
};
export default RemandCell;
