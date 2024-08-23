import { BaseEntityType } from "@/types";
import { Table } from "@tanstack/react-table";

type GetSelectedTableIdsPropType<T extends BaseEntityType> = {
    table: Table<T>;
};

export const getSelectedTableIds = <T extends BaseEntityType>({
    table,
}: GetSelectedTableIdsPropType<T>) => {
    return table.getSelectedRowModel().flatRows.map((item) => {
        return item.original.locale
            ? `${item.original.locale}:${item.original.id}`
            : item.original.id;
    });
};
