import React, { useRef } from "react";
import { BoxProps, Button, ButtonGroup, SimpleGrid } from "@chakra-ui/react";
import { FormFieldType, MetaUtilityType } from "@/types";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { BaseForm } from "./BaseForm";
import { useContentsKey } from "@/features/misc/hooks/useContentsKey";
import { adminPrefix } from "@/config";
import { CharacterChange } from "./Accessibility/CharacterChange";
import { AccessibilityCheck } from "./Accessibility/AccessibilityCheck";

type FormWithoutConfirmProp<TFormValue extends FieldValues> = {
    children: React.ReactNode;
    onSubmit: SubmitHandler<TFormValue>;
    isLoading: boolean;
    isEdit: boolean;
    isBack?: boolean;
    isAccessibility?: boolean;
} & Omit<BoxProps, "onSubmit" | "children" | "id">;

export const FormWithoutConfirm = <
    TFormValue extends FieldValues = Record<string, any>
>(
    props: FormWithoutConfirmProp<TFormValue>
) => {
    const {
        children,
        onSubmit,
        isLoading,
        isEdit,
        isBack = true,
        isAccessibility,
        ...boxProps
    } = props;

    const navigate = useNavigate();
    const contentsKey = useContentsKey();

    const submitRef = useRef<HTMLButtonElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <BaseForm<TFormValue>
            onSubmit={onSubmit}
            formRef={formRef}
            {...boxProps}
        >
            <>
                {children}

                {isAccessibility && formRef && (
                    <SimpleGrid columns={2} my={4}>
                        <CharacterChange formRef={formRef} />
                        <AccessibilityCheck formRef={formRef} />
                    </SimpleGrid>
                )}

                <ButtonGroup variant="outline" spacing="6" mt="4">
                    {isBack && (
                        <Button
                            type="button"
                            size="lg"
                            bg={"gray.400"}
                            color={"white"}
                            _hover={{
                                bg: "gray.500",
                            }}
                            onClick={(e) => {
                                navigate(`${adminPrefix}${contentsKey}`);
                            }}
                        >
                            一覧へ戻る
                        </Button>
                    )}
                    <Button
                        type="submit"
                        size="lg"
                        bg={"blue.400"}
                        color={"white"}
                        _hover={{
                            bg: "blue.500",
                        }}
                        isLoading={isLoading}
                        ref={submitRef}
                    >
                        {isEdit ? "更新" : "登録"}
                    </Button>
                </ButtonGroup>
            </>
        </BaseForm>
    );
};
