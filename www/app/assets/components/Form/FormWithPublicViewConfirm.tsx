import {
    BoxProps,
    Button,
    ButtonGroup,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    SimpleGrid,
    UseDisclosureReturn,
    useDisclosure,
    HStack,
} from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { FieldValues, SubmitHandler, useFormContext } from "react-hook-form";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import { BaseForm } from "./BaseForm";
import { PreviewContentModal } from "../elements/Misc/PreviewContentModal";
import { useContentsKey } from "@/features/misc/hooks/useContentsKey";
import { adminPrefix } from "@/config";
import { CharacterChange } from "./Accessibility/CharacterChange";
import { AccessibilityCheck } from "./Accessibility/AccessibilityCheck";

type FormWithPublicViewConfirmProp<TFormValue extends FieldValues> = {
    children: React.ReactNode;
    onSubmit: SubmitHandler<TFormValue>;
    isLoading: boolean;
    isEdit: boolean;
    isConfirm: boolean;
    setConfirm: {
        on: () => void;
        off: () => void;
        toggle: () => void;
    };
    setValid: {
        on: () => void;
        off: () => void;
        toggle: () => void;
    };
    modalAction: UseDisclosureReturn;
    html: string;
    isBack?: true;
    isAccessibility?: boolean;
} & Omit<BoxProps, "onSubmit" | "children" | "id">;

export const FormWithPublicViewConfirm = <
    TFormValue extends FieldValues = Record<string, any>
>(
    props: FormWithPublicViewConfirmProp<TFormValue>
) => {
    const {
        children,
        onSubmit,
        isLoading,
        isEdit,
        isConfirm,
        setConfirm,
        setValid,
        modalAction,
        html,
        isBack,
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
                    <SimpleGrid
                        columns={2}
                        my={4}
                        bg="gray.100"
                        p="4"
                        rounded="2xl"
                    >
                        <CharacterChange formRef={formRef} />
                        <AccessibilityCheck formRef={formRef} />
                    </SimpleGrid>
                )}

                {!isConfirm ? (
                    <HStack w="full" justifyContent="center">
                        <ButtonGroup variant="outline" spacing="6">
                            {isBack && (
                                <Button
                                    type="button"
                                    size="lg"
                                    bg={"gray.400"}
                                    color={"white"}
                                    _hover={{
                                        bg: "blue.500",
                                    }}
                                    onClick={(e) => {
                                        navigate(
                                            `${adminPrefix}${contentsKey}`
                                        );
                                    }}
                                >
                                    一覧へ戻る
                                </Button>
                            )}
                            <Button
                                type="submit"
                                size="lg"
                                w="250px"
                                bg={"cyan.800"}
                                color={"white"}
                                _hover={{
                                    bg: "cyan.700",
                                }}
                                isLoading={isConfirm}
                            >
                                確認
                            </Button>
                        </ButtonGroup>
                    </HStack>
                ) : (
                    <HStack w="full" justifyContent="center">
                        <ButtonGroup variant="outline" spacing="6">
                            <Button
                                type="button"
                                size="lg"
                                bg={"gray.400"}
                                color={"white"}
                                _hover={{
                                    bg: "blue.500",
                                }}
                                onClick={setConfirm.off}
                            >
                                戻る
                            </Button>
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                display="none"
                                ref={submitRef}
                            >
                                {isEdit ? "更新" : "登録"}
                            </Button>
                        </ButtonGroup>
                    </HStack>
                )}

                <PreviewContentModal
                    isOpen={modalAction.isOpen}
                    onClose={modalAction.onClose}
                    html={html}
                    isLoading={isLoading}
                    setValidOff={setValid.off}
                    setConfirmOff={setConfirm.off}
                    submitRef={submitRef}
                    isEdit={isEdit}
                />
            </>
        </BaseForm>
    );
};
