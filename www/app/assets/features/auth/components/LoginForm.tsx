import React from "react";
import { Alert, AlertIcon, Button, Input, Stack } from "@chakra-ui/react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import { BaseInputField } from "@/components/Form/BaseInputField";
import { adminPrefix } from "@/config";
import { BaseFieldWrapper } from "@/components/Form/BaseFieldWrapper";

type LoginValues = {
    username: string;
    password: string;
};

export const LoginForm = () => {
    const { login, user } = useAuth();

    const navigate = useNavigate();

    const methods = useFormContext<LoginValues>();

    return (
        <Stack spacing={1}>
            {login.isError && (
                <Alert status="error">
                    <AlertIcon />
                    ユーザー名かパスワードが不正です
                </Alert>
            )}

            <form
                onSubmit={methods.handleSubmit(async (values) => {
                    const data = await login.mutateAsync(values);
                    if (data?.meta.redirectUri) {
                        if (data.meta.redirectUri.includes("/preview")) {
                            window.open(data.meta.redirectUri, "_blank");
                            navigate(adminPrefix, {
                                replace: true,
                            });
                            location.reload();
                        } else {
                            navigate(data.meta.redirectUri, {
                                replace: true,
                            });
                            location.reload();
                        }
                    } else {
                        navigate(adminPrefix, {
                            replace: true,
                        });
                        location.reload();
                    }
                })}
            >
                <Stack spacing={4}>
                    <BaseFieldWrapper
                        label={"ユーザー名"}
                        error={methods.formState.errors.username}
                        isRequired={true}
                    >
                        <Input
                            type={"input"}
                            placeholder={"ユーザー名を入力してください"}
                            isRequired={true}
                            {...methods.register("username")}
                        />
                    </BaseFieldWrapper>
                    <BaseFieldWrapper
                        label={"パスワード"}
                        error={methods.formState.errors.password}
                        isRequired={true}
                    >
                        <Input
                            type={"password"}
                            placeholder={"パスワードを入力してください"}
                            isRequired={true}
                            {...methods.register("password")}
                        />
                    </BaseFieldWrapper>

                    <Stack spacing={8} pt={2}>
                        <Button
                            type="submit"
                            isLoading={login.isLoading}
                            size="lg"
                            bg={"blue.400"}
                            color={"white"}
                            _hover={{
                                bg: "blue.500",
                            }}
                        >
                            ログイン
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Stack>
    );
};
