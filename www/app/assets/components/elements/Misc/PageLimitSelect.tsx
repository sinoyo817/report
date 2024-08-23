import { FormControl, FormLabel, Select, SimpleGrid } from "@chakra-ui/react";
import React from "react";

export type PageLimitSelectPropType = {
    pageLimit: number;
    setPageLimit: React.Dispatch<React.SetStateAction<number>>;
};

const PageLimitSelect = (props: PageLimitSelectPropType) => {
    const { pageLimit, setPageLimit } = props;

    return (
        <FormControl>
            <FormLabel htmlFor="limit">件数</FormLabel>
            <Select
                value={pageLimit}
                onChange={(e) => {
                    setPageLimit(parseInt(e.target.value));
                }}
                id="limit"
            >
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
            </Select>
        </FormControl>
    );
};
export default PageLimitSelect;
