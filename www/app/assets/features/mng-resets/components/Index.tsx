import React, { useEffect } from "react";

import {
    Box,
    Button,
    Center,
    List,
    ListItem,
    Text,
    UnorderedList,
} from "@chakra-ui/react";
import { usePostReset } from "../api/postReset";
import { AxiosError } from "axios";

const Index = () => {
    const mutation = usePostReset({});

    const handleClick = async () => {
        if (confirm("データをリセットしますがよろしいですか？")) {
            try {
                const data = await mutation.mutateAsync();
            } catch (e) {
                if (e instanceof AxiosError) {
                    if (e.response?.status === 422) {
                        //
                    }
                }
            }
        }
    };

    return (
        <Box>
            <Box bg="white" p="4" boxShadow="md">
                <Text fontWeight="bold">
                    以下のコンテンツの入力データがすべて削除されます
                </Text>
                <UnorderedList>
                    <ListItem>お知らせ等の各種入力データ</ListItem>
                    <ListItem>管理者(QTmedia管理者以外)</ListItem>
                    <ListItem>ファイル</ListItem>
                    <ListItem>アセット</ListItem>
                    <ListItem>各種設定管理</ListItem>
                    <ListItem>権限管理</ListItem>
                </UnorderedList>
            </Box>
            <Center mt="4">
                <Button
                    colorScheme="red"
                    onClick={handleClick}
                    isLoading={mutation.isLoading}
                >
                    リセット
                </Button>
            </Center>
        </Box>
    );
};

export default Index;
