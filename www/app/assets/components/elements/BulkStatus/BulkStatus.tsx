import React from "react";
import { ApprovalStatusOptionType, adminPrefix } from "@/config";
import { useStatusChange } from "@/features/misc/api/statusChange";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    FormControl,
    FormLabel,
    HStack,
    Select,
    Skeleton,
    Text,
    Textarea,
    useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";

import { useContentsKey } from "@/features/misc/hooks/useContentsKey";
import { useStatusOptions } from "@/features/misc/hooks/useStatusOptions";

export type BulkStatusProps<TList> = {
    ids: string[];
    resetRowSelection: (defaultState?: boolean | undefined) => void;
    statusKey?: string;
};

export const BulkStatus = <TList extends Record<string, unknown>>(
    props: BulkStatusProps<TList>
) => {
    const { ids, resetRowSelection, statusKey } = props;
    const [selected, setSelected] = useState("");
    const [summary, setSummary] = useState("");
    const [alertData, setAlertData] = useState<ApprovalStatusOptionType>();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const mutation = useStatusChange<TList>();

    const cancelRef = useRef(null);
    const contentsKey = useContentsKey();

    const approvalStatusOptions = useStatusOptions({ statusKey: statusKey });

    useEffect(() => {
        if (selected && approvalStatusOptions) {
            const alertData = approvalStatusOptions.find(
                (options) => options.status === selected
            );
            setAlertData(alertData);
        }
    }, [approvalStatusOptions, selected]);

    const handleSubmit = async () => {
        const data = {
            ids: ids,
            status: selected,
        };
        try {
            const response = await mutation.mutateAsync({
                data:
                    selected === "remand"
                        ? { ...data, summary: summary }
                        : data,
                contentsKey: statusKey || contentsKey,
            });
            resetRowSelection();
            setSummary("");
        } catch (e) {
            //
        }
    };

    return (
        <>
            <HStack w="md" my="3">
                <Select
                    name="status"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    size="md"
                    bg="white"
                    disabled={ids.length <= 0}
                    placeholder="一括処理"
                >
                    {approvalStatusOptions &&
                        approvalStatusOptions.map((options) => (
                            <option key={options.status} value={options.status}>
                                {options.title}
                            </option>
                        ))}
                </Select>
                <Button
                    type="button"
                    bg={
                        ids.length <= 0 || selected.length <= 0
                            ? "gray.400"
                            : "cyan.800"
                    }
                    color="white"
                    disabled={ids.length <= 0 || selected.length <= 0}
                    onClick={onOpen}
                >
                    実行
                </Button>
            </HStack>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            {(alertData && alertData.alertTitle) || "操作"}
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            {(alertData && alertData.alertBody) ||
                                "処理を実行します。よろしいですか？"}
                            {selected === "remand" && (
                                <Box>
                                    <FormControl>
                                        <FormLabel>
                                            <Text
                                                as="span"
                                                size="xs"
                                                fontWeight="bold"
                                            >
                                                差戻し理由
                                            </Text>
                                        </FormLabel>
                                        <Textarea
                                            placeholder="差戻し理由を入力してください"
                                            onChange={(e) =>
                                                setSummary(e.target.value)
                                            }
                                            name="summary"
                                            value={summary}
                                        />
                                    </FormControl>
                                </Box>
                            )}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                キャンセル
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={(e) => {
                                    onClose();
                                    handleSubmit();
                                }}
                                ml={3}
                            >
                                {(alertData && alertData.alertButton) ||
                                    alertData?.title}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};
