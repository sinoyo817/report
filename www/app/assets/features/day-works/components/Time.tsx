import React, { useEffect, useState } from "react";
import {
    Text,
    Box,
} from "@chakra-ui/react";

import { useDayWorkMeta } from "../api/getDayWorkMeta";

import { useFormContext } from "react-hook-form";

import { DayWorkFormValuesType, DayWorkType } from "../types";

import { BaseBlockEntityType } from "@/types";

// ブロックvalue03を自動計算するcomponent
const Time = () => {

    const { watch, setValue } = useFormContext<DayWorkFormValuesType>();

    const blocks = watch("blocks") || [];

    const [total, setTotal] = useState(0);
        
    const calculateTotal = (blocks: BaseBlockEntityType[]) => {
        return blocks.reduce((sum, block) => {
            const value03 = block.value03;
            if (typeof value03 === 'string') {
                return sum + (parseFloat(value03) || 0);
            }
            return sum;
        }, 0);
    };

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name?.startsWith("blocks")) {
                const valTotal = calculateTotal((value.blocks || []) as any[]);
                setTotal(valTotal);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    return (
        <Box
            border="2px"
            borderColor="gray.200"
            p={4}
            borderRadius="md"
            bg="gray.50"
            textAlign="center"
        >
            <Text fontSize="lg" fontWeight="bold">
                作業時間: {total}
            </Text>
        </Box>
    );
};

export default Time;
