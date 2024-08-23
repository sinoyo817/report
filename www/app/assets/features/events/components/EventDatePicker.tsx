import {
    Box,
    Button,
    Center,
    Collapse,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Select,
    SimpleGrid,
    Spacer,
    Stack,
    Switch,
    Text,
    useBoolean,
    useBreakpointValue,
    useDisclosure,
    useMediaQuery,
    Wrap,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

import {
    SubmitHandler,
    useController,
    useFormContext,
    useWatch,
} from "react-hook-form";
import "flatpickr/dist/themes/material_blue.css";
import { Japanese } from "flatpickr/dist/l10n/ja";

import Flatpickr from "react-flatpickr";
import { BaseFieldWrapper } from "@/components/Form/BaseFieldWrapper";
import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
import "dayjs/locale/ja";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { BaseDatePickerField } from "@/components/Form/BaseDatePickerField";
import { BaseTimePickerField } from "@/components/Form/BaseTimePickerField";
import { useStatusOptions } from "@/features/misc/hooks/useStatusOptions";
import { BaseForm } from "@/components/Form/BaseForm";
import { AxiosError } from "axios";
import { ResponseValidationType } from "@/types";
import { EventFormValuesType } from "../types";

type FormPropType = {
    defaultDate?: string;
    model?: string;
    isConfirm?: boolean;
    isEdit?: boolean;
};

dayjs.extend(minMax);

const EventDatePicker = (props: FormPropType) => {
    const { model, defaultDate, isConfirm = false, isEdit = false } = props;

    const [checked, setChecked] = useBoolean();

    const { setError, setValue, watch } = useFormContext<EventFormValuesType>();

    const { field: pickerField, fieldState: pickerFieldState } =
        useController<EventFormValuesType>({
            name: "event_dates_values",
            defaultValue: defaultDate,
            // rules: { required: "日付を選択してください" },
        });

    const pickerDate = watch("event_dates_values");

    const dateRef = useRef<Flatpickr>(null);

    useEffect(() => {
        if (checked) {
            dateRef?.current?.flatpickr.set("mode", "range");
        } else {
            dateRef?.current?.flatpickr.set("mode", "multiple");
        }
        if (pickerDate) {
            dateRef?.current?.flatpickr.setDate(
                pickerDate.split(",").map((item) => new Date(item)),
                true
            );
        }

        // dateRef?.current?.flatpickr.updateValue();
    }, [checked, dateRef]);

    useEffect(() => {
        if (dateRef && defaultDate) {
            dateRef.current?.flatpickr.setDate(
                defaultDate.split(",").map((item) => new Date(item)),
                true
            );
        }
    }, [dateRef, defaultDate]);

    return (
        <Box my="2">
            <FormControl display="flex" alignItems="center">
                <HStack>
                    <FormLabel htmlFor="mode" mb="0">
                        <Text as="span" size="xs" fontWeight="bold">
                            複数選択
                        </Text>
                    </FormLabel>
                    <Switch id="mode" onChange={setChecked.toggle} />
                    <FormLabel htmlFor="mode" mb="0">
                        <Text as="span" size="xs" fontWeight="bold">
                            範囲選択
                        </Text>
                    </FormLabel>
                    <Spacer />
                    <Button
                        type="button"
                        onClick={(e) => {
                            dateRef?.current?.flatpickr.clear();
                        }}
                    >
                        クリア
                    </Button>
                </HStack>
            </FormControl>

            <BaseFieldWrapper label="日付" error={pickerFieldState.error}>
                <Flatpickr
                    defaultValue={defaultDate}
                    onChange={(selectedDates, dateStr, instance) => {
                        if (instance.config.mode === "range") {
                            const startDate = dayjs.min(
                                selectedDates.map((item) => dayjs(item))
                            );
                            const endDate = dayjs.max(
                                selectedDates.map((item) => dayjs(item))
                            );

                            const start = startDate.locale("ja");

                            const end = endDate.locale("ja");

                            if (selectedDates.length > 2) {
                                instance.setDate(
                                    [start.toDate(), end.toDate()],
                                    false
                                );
                            }
                            const dates = [];
                            const diffDays = end.diff(start, "d");
                            for (let i = 0; i <= diffDays; i++) {
                                const currentData = start.add(i, "day");
                                dates.push(currentData.format("YYYY-MM-DD"));
                            }

                            pickerField.onChange(dates.join(","));
                        } else {
                            pickerField.onChange(dateStr);
                        }
                    }}
                    options={{
                        dateFormat: "Y-m-d",
                        locale: Japanese,
                        inline: true,
                        mode: "multiple",
                        static: true,
                        showMonths: 3,
                        conjunction: ",",
                    }}
                    hidden={true}
                    name="calendar-date"
                    ref={dateRef}
                />
            </BaseFieldWrapper>
        </Box>
    );
};

export default EventDatePicker;
