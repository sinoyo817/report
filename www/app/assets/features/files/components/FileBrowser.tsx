import React from "react";
import { useState, useEffect } from "react";
import {
    Box,
    BoxProps,
    Button,
    ButtonGroup,
    Center,
    Divider,
    Heading,
    HStack,
    ImageProps,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    Skeleton,
    Text,
    useBreakpointValue,
    useDisclosure,
    useRadioGroup,
} from "@chakra-ui/react";
import { useFiles } from "../api/getFiles";
import { FileFilterParamType, FileType } from "../types";
import { FileRadioWrapper } from "@/components/Form/FileRadioWrapper";
import { ImageTumb } from "@/components/elements/File/ImageThum";
import { FileTumb } from "@/components/elements/File/FileThum";
import { Pagination } from "@/components/elements/Misc/Pagination";
import { FilePondOptions } from "filepond";
import UploadFile from "./Upload";
import { Tumb } from "@/components/elements/File/Tumb";

type FileBrowserProps = {
    type: "image" | "file";
    onChange: (...event: any[]) => void;
    value: string;
    model?: string;
    isConfirm?: boolean;
    editFormType?: "button" | "icon";
    thumBoxWrapProps?: BoxProps;
    thumBoxProps?: BoxProps;
    tumbImageProps?: ImageProps;
    fileFindModel?: string | string[];
    ignoreFindModel?: boolean;
} & FilePondOptions;

export const FileBrowser = (props: FileBrowserProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {
        type,
        onChange,
        value,
        model,
        editFormType = "button",
        isConfirm = false,
        thumBoxWrapProps,
        thumBoxProps,
        tumbImageProps,
        fileFindModel,
        ignoreFindModel = false,
        ...filePondProps
    } = props;

    // console.log(value);
    // console.log(fileFindModel);

    const columnValue = useBreakpointValue({
        base: 1,
        lg: 4,
    });
    const fileColumnValue = useBreakpointValue({
        base: 2,
        lg: 6,
    });

    const [q, setQ] = useState<string>();

    const [param, setParam] = useState<FileFilterParamType>(
        ignoreFindModel
            ? { type: type }
            : {
                  model: fileFindModel || model,
                  type: type,
              }
    );

    const { data, isLoading, refetch } = useFiles({
        filters: param,
        options: { enabled: true },
    });

    const [pageNumber, setPagination] = useState(1);

    const [current, setCurrent] = useState<FileType>();

    const {
        getRootProps,
        getRadioProps,
        value: radioValue,
        setValue: setRadioValue,
    } = useRadioGroup({
        name: "file",
        defaultValue: value,
    });

    useEffect(() => {
        setParam({ ...param, page: pageNumber });
    }, [pageNumber, setParam]);

    // useEffect(() => {
    //     if (isOpen) {
    //         refetch();
    //     }
    // }, [isOpen, refetch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQ(e.target.value);
    };
    const handleClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        setParam({ ...param, ...{ q: q, page: 1 } });
    };

    return (
        <>
            {value && typeof value === "string" && (
                <Tumb value={value} setCurrent={setCurrent} current={current} />
            )}
            {!isConfirm && (
                <>
                    <HStack my="4">
                        <ButtonGroup spacing="6">
                            <Button
                                onClick={onOpen}
                                bg="cyan.800"
                                color="white"
                                _hover={{ bg: "cyan.700" }}
                            >
                                {type === "image"
                                    ? "画像を選択"
                                    : "ファイルを選択"}
                            </Button>
                            {current && (
                                <Button
                                    colorScheme="red"
                                    onClick={() => {
                                        onChange("");
                                        setRadioValue("");
                                    }}
                                >
                                    {type === "image"
                                        ? "画像の選択を削除"
                                        : "ファイルの選択を削除"}
                                </Button>
                            )}
                        </ButtonGroup>
                    </HStack>
                    <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader></ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Box w="full" mt="2">
                                    {model && (
                                        <>
                                            <Box mb="1">
                                                <Text color="red.400">
                                                    ※
                                                    {type === "image"
                                                        ? "画像"
                                                        : "ファイル"}
                                                    のファイルサイズの上限は
                                                    {filePondProps.maxFileSize ||
                                                        "5MB"}
                                                    です
                                                </Text>
                                            </Box>
                                            <UploadFile
                                                model={model}
                                                {...filePondProps}
                                            />
                                        </>
                                    )}
                                </Box>
                                <Box w="full" py="2">
                                    <Center>
                                        <Heading as="h4" fontSize="xl" my="4">
                                            {type === "image"
                                                ? "画像一覧"
                                                : "ファイル一覧"}
                                        </Heading>
                                    </Center>
                                    <SimpleGrid
                                        columns={2}
                                        w="full"
                                        spacing="4"
                                        // display="inline-flex"
                                        // boxShadow="md"
                                        // p="2"
                                        my="2"
                                    >
                                        <Box
                                            display="flex"
                                            justifyContent="flex-start"
                                        >
                                            <HStack>
                                                <Input
                                                    onChange={handleChange}
                                                    value={q}
                                                />
                                                <Button
                                                    colorScheme="blue"
                                                    onClick={handleClick}
                                                >
                                                    検索
                                                </Button>
                                            </HStack>
                                        </Box>

                                        <Box
                                            display="flex"
                                            justifyContent="flex-end"
                                        >
                                            {data?.collection && (
                                                <Pagination
                                                    collection={data.collection}
                                                    setPagination={
                                                        setPagination
                                                    }
                                                    pageNumber={pageNumber}
                                                />
                                            )}
                                        </Box>
                                        <Box></Box>
                                        <Box
                                            // my="3"
                                            // w="20"
                                            display="flex"
                                            justifyContent="flex-end"
                                        >
                                            <ButtonGroup spacing="6">
                                                <Button
                                                    colorScheme="gray"
                                                    onClick={onClose}
                                                    boxShadow="md"
                                                >
                                                    閉じる
                                                </Button>
                                                <Button
                                                    colorScheme="blue"
                                                    onClick={() => {
                                                        onChange(radioValue);
                                                        onClose();
                                                    }}
                                                    boxShadow="md"
                                                >
                                                    選択
                                                </Button>
                                            </ButtonGroup>
                                        </Box>
                                    </SimpleGrid>

                                    <Divider my="6" />
                                    <Skeleton
                                        isLoaded={!isLoading}
                                        minH="100px"
                                    >
                                        {type === "image" && (
                                            <SimpleGrid
                                                columns={columnValue}
                                                spacing={2}
                                                p="4"
                                                bg="gray.50"
                                                // boxShadow="md"
                                                {...getRootProps()}
                                            >
                                                {data?.data &&
                                                    data.data.map((value) => {
                                                        return (
                                                            <Box
                                                                key={value.id}
                                                                bg="white"
                                                            >
                                                                <FileRadioWrapper
                                                                    {...getRadioProps(
                                                                        {
                                                                            value: value.id,
                                                                        }
                                                                    )}
                                                                >
                                                                    <Center>
                                                                        {value.mime.includes(
                                                                            "image/"
                                                                        ) ? (
                                                                            <ImageTumb
                                                                                isCaption={
                                                                                    true
                                                                                }
                                                                                filePath={
                                                                                    value.fileCmsPath
                                                                                }
                                                                                filename={
                                                                                    value.filename
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            <FileTumb
                                                                                isCaption={
                                                                                    true
                                                                                }
                                                                                filePath={
                                                                                    value.fileCmsPath
                                                                                }
                                                                                filename={
                                                                                    value.filename
                                                                                }
                                                                                mime={
                                                                                    value.mime
                                                                                }
                                                                            />
                                                                        )}
                                                                    </Center>
                                                                </FileRadioWrapper>
                                                            </Box>
                                                        );
                                                    })}
                                            </SimpleGrid>
                                        )}
                                        {type === "file" && (
                                            <SimpleGrid
                                                columns={fileColumnValue}
                                                spacing={2}
                                                p="4"
                                                bg="gray.50"
                                                // boxShadow="md"
                                                {...getRootProps()}
                                            >
                                                {data?.data &&
                                                    data.data.map((value) => {
                                                        return (
                                                            <Box
                                                                key={value.id}
                                                                bg="white"
                                                            >
                                                                <FileRadioWrapper
                                                                    {...getRadioProps(
                                                                        {
                                                                            value: value.id,
                                                                        }
                                                                    )}
                                                                >
                                                                    <Center>
                                                                        {value.mime.includes(
                                                                            "image/"
                                                                        ) ? (
                                                                            <ImageTumb
                                                                                isCaption={
                                                                                    true
                                                                                }
                                                                                filePath={
                                                                                    value.fileCmsPath
                                                                                }
                                                                                filename={
                                                                                    value.filename
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            <FileTumb
                                                                                isCaption={
                                                                                    true
                                                                                }
                                                                                filePath={
                                                                                    value.fileCmsPath
                                                                                }
                                                                                filename={
                                                                                    value.filename
                                                                                }
                                                                                mime={
                                                                                    value.mime
                                                                                }
                                                                            />
                                                                        )}
                                                                    </Center>
                                                                </FileRadioWrapper>
                                                            </Box>
                                                        );
                                                    })}
                                            </SimpleGrid>
                                        )}
                                        <Divider />
                                        <SimpleGrid
                                            columns={2}
                                            w="full"
                                            spacing="4"
                                            // display="inline-flex"
                                            // boxShadow="md"
                                            // p="2"
                                            my="2"
                                        >
                                            <Box></Box>

                                            <Box
                                                display="flex"
                                                justifyContent="flex-end"
                                            >
                                                {data?.collection && (
                                                    <Pagination
                                                        collection={
                                                            data.collection
                                                        }
                                                        setPagination={
                                                            setPagination
                                                        }
                                                        pageNumber={pageNumber}
                                                    />
                                                )}
                                            </Box>
                                            <Box></Box>
                                            <Box
                                                // my="3"
                                                // w="20"
                                                display="flex"
                                                justifyContent="flex-end"
                                            >
                                                <ButtonGroup spacing="6">
                                                    <Button
                                                        colorScheme="gray"
                                                        onClick={onClose}
                                                        boxShadow="md"
                                                    >
                                                        閉じる
                                                    </Button>
                                                    <Button
                                                        colorScheme="blue"
                                                        onClick={() => {
                                                            onChange(
                                                                radioValue
                                                            );
                                                            onClose();
                                                        }}
                                                        boxShadow="md"
                                                    >
                                                        選択
                                                    </Button>
                                                </ButtonGroup>
                                            </Box>
                                        </SimpleGrid>
                                    </Skeleton>
                                </Box>
                            </ModalBody>
                            <ModalFooter></ModalFooter>
                        </ModalContent>
                    </Modal>
                </>
            )}
        </>
    );
};
