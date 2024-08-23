import {
    CharacterChangeOptionsType,
    characterChangeOptions,
} from "@/config/accessibility";
import {
    halfWidthAlphanumeric,
    isAlphabeticCharacters,
    isAlphanumeric,
    isHalfWidthBlank,
    isHankakuKana,
    toFullZenkana,
    toHalfWidthBlank,
    toHanKaku,
} from "@/utils/characterChangeFunc";
import {
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    Stack,
    useDisclosure,
    useToast,
    Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

export type CharacterChangeProps = {
    formRef: React.RefObject<HTMLFormElement>;
};

export const CharacterChange = (props: CharacterChangeProps) => {
    const { formRef } = props;

    const { setValue } = useFormContext();
    const toast = useToast();

    const defaultValue = Object.keys(characterChangeOptions);

    const [check, setCheck] = useState(defaultValue);

    const change = () => {
        if (formRef.current && check.length > 0) {
            const inputs = formRef.current.querySelectorAll(
                'input[type="text"]:not([readonly]):not([type="hidden"]), input[type="url"]:not([readonly]):not([type="hidden"]), input[type="email"]:not([readonly]):not([type="hidden"]), textarea'
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
                        ckeditor.updateElement();
                    }

                    const value = input.value;
                    if (!value) {
                        continue;
                    }
                    let changeData = value;
                    for (const c of check) {
                        if (
                            c === "full_width_kana" &&
                            isHankakuKana(changeData)
                        ) {
                            changeData = toFullZenkana(changeData);
                        }
                        if (
                            c === "half_width_alphanumeric" &&
                            isAlphanumeric(value)
                        ) {
                            changeData = halfWidthAlphanumeric(changeData);
                        }
                        if (
                            c === "alphabetic_characters" &&
                            isAlphabeticCharacters(changeData)
                        ) {
                            changeData = toHanKaku(changeData);
                        }
                        if (
                            c === "half_width_blank" &&
                            isHalfWidthBlank(changeData)
                        ) {
                            changeData = toHalfWidthBlank(changeData);
                        }
                    }

                    if (ckeditor) {
                        ckeditor.setData(changeData);
                    } else {
                        setValue(input.name, changeData);
                    }
                }
            }
            toast({
                position: "top",
                title: `一括変換を実行しました`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <>
            <Box>
                <Text as='b'>一括変換</Text><br />             
                <Box py="3">
                    <CheckboxGroup
                        colorScheme="blue"
                        // defaultValue={defaultValue}
                        value={check}
                        onChange={(e) => setCheck(e as string[])}
                    >
                        <Stack spacing={2}>
                            {Object.entries(characterChangeOptions).map(
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
                    onClick={change}
                    color="white" 
                    bg="cyan.800" 
                    _hover={{
                        bg: "cyan.700",
                    }}
                >
                    実行
                </Button>
            </Box>
        </>
    );
};
