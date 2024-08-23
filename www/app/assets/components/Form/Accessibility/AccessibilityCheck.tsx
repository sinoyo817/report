import { accessibilityCheckOptions } from "@/config/accessibility";
import { useWatchFormValues } from "@/features/misc/hooks/useWatchFormValues";
import {
    AccessibilityCheckMessageType,
    accessibilityCheckMethods,
} from "@/utils/accessiblityCheckFunc";
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    Code,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    LinkBox,
    LinkOverlay,
    ListItem,
    Skeleton,
    Stack,
    Text,
    UnorderedList,
    useBoolean,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";

export type AccessibilityCheckProps = {
    formRef: React.RefObject<HTMLFormElement>;
};

export type AccessibilityCheckErrorsValueType = {
    elm: HTMLInputElement | HTMLTextAreaElement | HTMLElement;
    errors: AccessibilityCheckMessageType[];
};

export type AccessibilityCheckErrors = Record<
    string,
    AccessibilityCheckErrorsValueType
>;

export const AccessibilityCheck = (props: AccessibilityCheckProps) => {
    const { formRef } = props;

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [isLoading, setIsLoading] = useBoolean();

    const [errors, setErrors] = useState<AccessibilityCheckErrors>({});

    const defaultValue = Object.keys(accessibilityCheckOptions);

    const [check, setCheck] = useState<(string | number)[]>(defaultValue);

    const values = useWatchFormValues();

    const handleClick = useCallback(async () => {
        onOpen();
        if (formRef.current && values && check.length > 0) {
            //
            const inputs = formRef.current.querySelectorAll(
                'input[type="text"]:not([readonly]):not([type="hidden"]), input[type="url"]:not([readonly]):not([type="hidden"]), input[type="email"]:not([readonly]):not([type="hidden"]), textarea, [data-accessibility]'
            );

            if (inputs) {
                setIsLoading.on();
                const newErrors: AccessibilityCheckErrors = {};
                for (let i = 0; i < inputs.length; i++) {
                    const el = inputs[i];
                    const input =
                        el.tagName === "TEXTAREA"
                            ? (el as HTMLTextAreaElement)
                            : (el as HTMLInputElement);
                    const ckeditor =
                        "CKEDITOR" in window &&
                        input.name &&
                        input.dataset.accessibility &&
                        input.dataset.accessibility === "wysiwyg" &&
                        CKEDITOR.instances[input.name];

                    if (ckeditor) {
                        ckeditor.updateElement();
                    }

                    // input.style.setProperty("border", "5px solid #D33C44");

                    const value = input.value;

                    if (!value) {
                        continue;
                    }

                    const type = input.dataset.accessibility
                        ? input.dataset.accessibility.split(",")
                        : ["text"];

                    let hasError = false;
                    let hasTargetError = false;

                    for (const c of check) {
                        if (
                            type.includes("wysiwyg") ||
                            type.includes(accessibilityCheckMethods[c].type)
                        ) {
                            //
                            const accessibilityTarget =
                                accessibilityCheckMethods[c].checkOther
                                    ? input.dataset.accessibilityTarget
                                    : undefined;
                            const targetElm = accessibilityTarget
                                ? formRef.current.querySelector<HTMLInputElement>(
                                      `input[name="${accessibilityTarget}"]`
                                  )
                                : undefined;

                            const result = await accessibilityCheckMethods[
                                c
                            ].method({
                                value: value,
                                editor: ckeditor ? ckeditor : undefined,
                                targetValue: targetElm
                                    ? targetElm.value
                                    : undefined,
                            });

                            if (result && result.length > 0) {
                                if (accessibilityCheckMethods[c].checkOther) {
                                    const elm = targetElm;

                                    const name = input.name;

                                    const existsError = name in newErrors;

                                    if (!existsError) {
                                        if (elm) {
                                            newErrors[name] = {
                                                elm: elm,
                                                errors: result,
                                            };
                                        }
                                    } else {
                                        newErrors[name].errors.push(...result);
                                    }
                                    hasTargetError = true;
                                } else {
                                    const elm = ckeditor
                                        ? ckeditor.container.$
                                        : input.type === "hidden"
                                        ? input.closest("div")
                                        : input;

                                    const name = input.name;

                                    const existsError = name in newErrors;

                                    if (!existsError) {
                                        if (elm) {
                                            newErrors[name] = {
                                                elm: elm,
                                                errors: result,
                                            };
                                        }
                                    } else {
                                        newErrors[name].errors.push(...result);
                                    }
                                    hasError = true;
                                }
                                //
                            }
                        }
                    }

                    const elm = ckeditor
                        ? ckeditor.container.$
                        : input.type === "hidden"
                        ? input.closest("div")
                        : input;

                    if (hasError) {
                        elm?.style.setProperty("border", "5px solid #D33C44");
                    } else {
                        elm?.style.removeProperty("border");
                    }

                    const accessibilityTarget =
                        input.dataset.accessibilityTarget;

                    const targetElm = accessibilityTarget
                        ? formRef.current.querySelector<HTMLInputElement>(
                              `input[name="${accessibilityTarget}"]`
                          )
                        : undefined;

                    if (hasTargetError) {
                        targetElm?.style.setProperty(
                            "border",
                            "5px solid #D33C44"
                        );
                    } else {
                        targetElm?.style.removeProperty("border");
                    }
                }
                setErrors(newErrors);
                setIsLoading.off();
            }
        }
    }, [formRef, values, check, isOpen]);

    useEffect(() => {
        if (!isOpen) {
            //
            if (formRef.current) {
                const inputs = formRef.current.querySelectorAll(
                    'input[type="text"]:not([readonly]):not([type="hidden"]), input[type="url"]:not([readonly]):not([type="hidden"]), input[type="email"]:not([readonly]):not([type="hidden"]), textarea, [data-accessibility]'
                );
                if (inputs) {
                    for (let i = 0; i < inputs.length; i++) {
                        const el = inputs[i];
                        const input =
                            el.tagName === "TEXTAREA"
                                ? (el as HTMLTextAreaElement)
                                : (el as HTMLInputElement);
                        const ckeditor =
                            "CKEDITOR" in window &&
                            input.name &&
                            input.dataset.accessibility &&
                            input.dataset.accessibility === "wysiwyg" &&
                            CKEDITOR.instances[input.name];

                        if (ckeditor) {
                            const wrap = ckeditor.container.$;
                            wrap.style.removeProperty("border");
                        } else {
                            input.style.removeProperty("border");
                        }
                    }
                }
            }
        }
    }, [isOpen]);
    // useEffect(() => {
    //     if (formRef.current && values && check.length > 0) {
    //         //
    //         const inputs = formRef.current.querySelectorAll(
    //             'input[type="text"]:not([readonly]):not([type="hidden"]), input[type="url"]:not([readonly]):not([type="hidden"]), input[type="email"]:not([readonly]):not([type="hidden"]), textarea, [data-accessibility]'
    //         );

    //         if (inputs) {
    //             inputs.forEach(async (el) => {
    //                 const input =
    //                     el.tagName === "TEXTAREA"
    //                         ? (el as HTMLTextAreaElement)
    //                         : (el as HTMLInputElement);
    //                 const ckeditor =
    //                     "CKEDITOR" in window &&
    //                     input.name &&
    //                     input.dataset.accessibility &&
    //                     input.dataset.accessibility === "wysiwyg" &&
    //                     CKEDITOR.instances[input.name];

    //                 if (ckeditor) {
    //                     ckeditor.updateElement();
    //                 }

    //                 // input.style.setProperty("border", "5px solid #D33C44");

    //                 if (!isOpen) {
    //                     input.style.removeProperty("border");
    //                     return;
    //                 }

    //                 const value = input.value;

    //                 if (!value) {
    //                     return;
    //                 }

    //                 const type = input.dataset.accessibility
    //                     ? input.dataset.accessibility.split(",")
    //                     : ["text"];

    //                 for (const c of check) {
    //                     if (
    //                         type.includes("wysiwyg") ||
    //                         type.includes(accessibilityCheckMethods[c].type)
    //                     ) {
    //                         //

    //                         const result = await accessibilityCheckMethods[
    //                             c
    //                         ].method({
    //                             value: value,
    //                             editor: ckeditor ? ckeditor : undefined,
    //                             targetValue: input.dataset.accessibilityTarget,
    //                         });

    //                         if (result) {
    //                             //
    //                             console.log(result);
    //                             const element = result.map((e) => (
    //                                 <>{e.message}</>
    //                             ));
    //                             if (errors) {
    //                                 setErrors([...errors, ...element]);
    //                             } else {
    //                                 setErrors(element);
    //                             }
    //                         }
    //                     }
    //                 }
    //             });
    //         }
    //     }
    // }, [check, formRef, isOpen, values]);

    // console.log("CKEDITOR" in window);
    // const input: HTMLInputElement | null =
    //     formRef.current.querySelector('[name="metadata.keywords"]');
    // if (input) {
    //     setValue(input.name, "tes");
    // }
    // const elm = CKEDITOR.instances["blocks.0.value01"];
    // elm.container.$.scrollIntoView({
    //     behavior: "smooth",
    //     block: "start",
    //     inline: "start",
    // });
    // console.log((elm.container.$.style.border = "10px solid #D33C44"));
    // console.log(CKEDITOR.instances["blocks.1.value01"].setData("test"));
    // console.log(getValues());

    // useEffect(() => {
    //     if (value) {
    //         console.log(value);
    //     }
    // }, [value]);

    return (
        <>
            <Box>
                <Text as='b'>アクセシビリティチェック</Text><br />                
                <Box py="3">
                    <CheckboxGroup
                        colorScheme="blue"
                        // defaultValue={defaultValue}
                        value={check}
                        onChange={(e) => setCheck(e)}
                    >
                        <Stack spacing={2}>
                            {Object.entries(accessibilityCheckOptions).map(
                                ([key, value]) => (
                                    <Checkbox size="sm" value={key} key={key}>
                                        {value}
                                    </Checkbox>
                                )
                            )}
                        </Stack>
                    </CheckboxGroup>
                </Box>
                <Button
                    onClick={handleClick} 
                    color="white" 
                    bg="cyan.800" 
                    _hover={{
                        bg: "cyan.700",
                    }}
                    >
                    実行
                </Button>
            </Box>
            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                closeOnOverlayClick={false}
                trapFocus={false}
                blockScrollOnMount={false}
                variant="alwaysOpen"
            >
                <DrawerContent>
                    {!isLoading && <DrawerCloseButton />}
                    <DrawerHeader>アクセシビリティチェック</DrawerHeader>

                    <DrawerBody>
                        <Skeleton isLoaded={!isLoading} minH="20">
                            {errors && Object.keys(errors).length > 0 ? (
                                <Box>
                                    {Object.entries(errors).map(
                                        ([name, error]) => (
                                            <LinkBox
                                                key={name}
                                                onClick={() => {
                                                    error.elm.scrollIntoView({
                                                        behavior: "smooth",
                                                        block: "start",
                                                        inline: "start",
                                                    });
                                                }}
                                                cursor="pointer"
                                            >
                                                <LinkOverlay>
                                                    {error.errors.map(
                                                        (item, index) => (
                                                            <Box
                                                                key={`error-list-${index}`}
                                                                p="1"
                                                            >
                                                                <Alert
                                                                    mb="2"
                                                                    status="warning"
                                                                >
                                                                    <AlertIcon />
                                                                    {
                                                                        item.message
                                                                    }
                                                                </Alert>
                                                                {item.target && (
                                                                    <>
                                                                        {item.target.map(
                                                                            (
                                                                                t,
                                                                                i
                                                                            ) => (
                                                                                <Box
                                                                                    key={`error-target-${i}`}
                                                                                >
                                                                                    <Code>
                                                                                        {t.before && (
                                                                                            <>
                                                                                                {
                                                                                                    t.before
                                                                                                }
                                                                                            </>
                                                                                        )}
                                                                                        {t.target && (
                                                                                            <Code colorScheme="red">
                                                                                                {
                                                                                                    t.target
                                                                                                }
                                                                                            </Code>
                                                                                        )}
                                                                                        {t.after && (
                                                                                            <>
                                                                                                {
                                                                                                    t.after
                                                                                                }
                                                                                            </>
                                                                                        )}
                                                                                    </Code>
                                                                                </Box>
                                                                            )
                                                                        )}
                                                                    </>
                                                                )}
                                                            </Box>
                                                        )
                                                    )}
                                                </LinkOverlay>
                                            </LinkBox>
                                        )
                                    )}
                                </Box>
                            ) : (
                                <Alert mb="2" status="success">
                                    <AlertIcon />
                                    アクセシビリティに問題はありませんでした
                                </Alert>
                            )}
                        </Skeleton>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};
