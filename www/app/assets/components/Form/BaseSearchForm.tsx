import React from "react";
import {
    Box,
    Button,
    ButtonGroup,
    Collapse,
    IconButton,
    Slide,
    useDisclosure,
} from "@chakra-ui/react";
import {
    SubmitHandler,
    FieldValues,
    useFormContext,
    useForm,
    UseFormReturn,
} from "react-hook-form";
import { SearchIcon } from "@chakra-ui/icons";
import { BaseView } from "../elements/Misc/BaseView";

type FormProps<TFormValues extends FieldValues> = {
    onSubmit: SubmitHandler<TFormValues>;
    children: React.ReactNode;
    id?: string;
};

export const BaseSearchForm = <TFormValues extends FieldValues>(
    props: FormProps<TFormValues>
) => {
    const { onSubmit, children, id } = props;

    const methods = useFormContext<TFormValues>();
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Box>
            {/* <IconButton
                aria-label="検索"
                icon={<SearchIcon />}
                onClick={onToggle}
                my="2"
            /> */}
            <Button
                aria-label="検索"
                bg="gray.100"
                leftIcon={<SearchIcon />}
                onClick={onToggle}
                border="solid 1px gray.300"
                my="2"
            >
                {isOpen ? "検索窓を閉じる" : "検索窓を開く"}
            </Button>
            <Collapse in={isOpen} animateOpacity>
                <BaseView shadow="md">
                    <form onSubmit={methods.handleSubmit(onSubmit)} id={id}>
                        {children}

                        <ButtonGroup variant="outline" spacing="6" mt="4">
                            <Button type="submit" bg="cyan.800" color="white">
                                検索
                            </Button>
                        </ButtonGroup>
                    </form>
                </BaseView>
            </Collapse>
        </Box>
    );
};
