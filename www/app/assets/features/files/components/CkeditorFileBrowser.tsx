import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    ButtonGroup,
    Center,
    Divider,
    Heading,
    HStack,
    Input,
    SimpleGrid,
    Skeleton,
    useBreakpointValue,
    useDisclosure,
    useRadioGroup,
    Wrap,
    WrapItem,
} from "@chakra-ui/react";
import { useFiles } from "../api/getFiles";
import { FileFilterParamType, FileType } from "../types";
import { FileRadioWrapper } from "@/components/Form/FileRadioWrapper";
import { ImageTumb } from "@/components/elements/File/ImageThum";
import { FileTumb } from "@/components/elements/File/FileThum";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "@/components/elements/Misc/Pagination";
import { UploadModal } from "./UpoloadModal";
import UploadFile from "./Upload";

export const CkeditorFileBrowser = () => {
    const [searchParams] = useSearchParams();

    const model = searchParams.get("model") || undefined;
    const type = searchParams.get("type");
    const funcNum = searchParams.get("CKEditorFuncNum");

    const columnValue = useBreakpointValue({
        base: 1,
        lg: 4,
    });
    const fileColumnValue = useBreakpointValue({
        base: 2,
        lg: 6,
    });

    const [q, setQ] = useState<string>();

    const [param, setParam] = useState<FileFilterParamType>({
        model: model,
        type: type,
    });

    const { data, isLoading } = useFiles({
        filters: param,
        options: { enabled: true },
    });

    const [pageNumber, setPagination] = useState(1);

    const { getRootProps, getRadioProps, value, setValue } = useRadioGroup();

    const handleSubmit = () => {
        if (value) {
            const file = data?.data.find((data) => data.id === value);

            if (file) {
                const fileUrl = file.fileCmsPath;
                window.opener.CKEDITOR.tools.callFunction(funcNum, fileUrl);

                window.close();
            }
        }
    };

    useEffect(() => {
        setParam({ ...param, page: pageNumber });
    }, [pageNumber, setParam]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQ(e.target.value);
    };
    const handleClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        setParam({ ...param, ...{ q: q, page: 1 } });
    };

    return (
        <Box width="100%" p="10">
            <Box w="full" mt="2">
                {model && <UploadFile model={model} />}
            </Box>
            <Box w="full">
                <Center>
                    <Heading as="h4" fontSize="xl" my="4">
                        {type === "image" ? "画像一覧" : "ファイル一覧"}
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
                    <Box display="flex" justifyContent="flex-start">
                        <HStack>
                            <Input onChange={handleChange} value={q} />
                            <Button colorScheme="blue" onClick={handleClick}>
                                検索
                            </Button>
                        </HStack>
                    </Box>

                    <Box display="flex" justifyContent="flex-end">
                        {data?.collection && (
                            <Pagination
                                collection={data.collection}
                                setPagination={setPagination}
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
                                colorScheme="blue"
                                onClick={handleSubmit}
                                boxShadow="md"
                            >
                                選択
                            </Button>
                        </ButtonGroup>
                    </Box>
                </SimpleGrid>

                <Divider my="6" />
                <Skeleton isLoaded={!isLoading} minH="100px">
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
                                        <Box key={value.id} bg="white">
                                            <FileRadioWrapper
                                                {...getRadioProps({
                                                    value: value.id,
                                                })}
                                            >
                                                <Center>
                                                    {value.mime.includes(
                                                        "image/"
                                                    ) ? (
                                                        <ImageTumb
                                                            isCaption={true}
                                                            filePath={
                                                                value.fileCmsPath
                                                            }
                                                            filename={
                                                                value.filename
                                                            }
                                                        />
                                                    ) : (
                                                        <FileTumb
                                                            isCaption={true}
                                                            filePath={
                                                                value.fileCmsPath
                                                            }
                                                            filename={
                                                                value.filename
                                                            }
                                                            mime={value.mime}
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
                                        <Box key={value.id}>
                                            <FileRadioWrapper
                                                {...getRadioProps({
                                                    value: value.id,
                                                })}
                                            >
                                                <Center>
                                                    {value.mime.includes(
                                                        "image/"
                                                    ) ? (
                                                        <ImageTumb
                                                            isCaption={true}
                                                            filePath={
                                                                value.fileCmsPath
                                                            }
                                                            filename={
                                                                value.filename
                                                            }
                                                        />
                                                    ) : (
                                                        <FileTumb
                                                            isCaption={true}
                                                            filePath={
                                                                value.fileCmsPath
                                                            }
                                                            filename={
                                                                value.filename
                                                            }
                                                            mime={value.mime}
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

                        <Box display="flex" justifyContent="flex-end">
                            {data?.collection && (
                                <Pagination
                                    collection={data.collection}
                                    setPagination={setPagination}
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
                                    colorScheme="blue"
                                    onClick={handleSubmit}
                                    boxShadow="md"
                                >
                                    選択
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </SimpleGrid>
                </Skeleton>
            </Box>
        </Box>
    );
};
