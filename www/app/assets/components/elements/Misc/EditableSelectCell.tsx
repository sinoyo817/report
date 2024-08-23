import { MetaUtilityType } from "@/types";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import { ButtonGroup, IconButton, Select, useBoolean } from "@chakra-ui/react";
import React, { useState } from "react";

export type EditableSelectCellPropType = {
    field: string;
    meta?: MetaUtilityType;
    remoteDataKey: string;
    remoteDataIndexKey?: string;
    remoteDataValueKey?: string;
    onSubmit: (nextValue: string) => Promise<void>;
    isEmpty?: boolean;
};

export const EditableSelectCell = (props: EditableSelectCellPropType) => {
    const {
        field,
        meta,
        onSubmit,
        remoteDataKey,
        remoteDataIndexKey,
        remoteDataValueKey,
        isEmpty = false,
    } = props;
    const [isEditing, setIsEditing] = useBoolean();
    const [value, setValue] = useState<string>(field);

    if (!meta) {
        return <></>;
    }

    const remoteData = remoteDataKey && meta[remoteDataKey];

    if (!remoteData) {
        return <></>;
    }

    const multipleValueOptions = Array.isArray(remoteData)
        ? remoteDataIndexKey &&
          remoteDataValueKey &&
          remoteData.map((item) => ({
              label: item[remoteDataIndexKey],
              value: item[remoteDataValueKey],
          }))
        : Object.entries(remoteData).map(([key, title]) => ({
              label: title,
              value: key,
          }));

    if (!multipleValueOptions) {
        return <></>;
    }

    const selectedValue = multipleValueOptions?.find(
        (item) => item.value === field
    );

    return isEditing ? (
        <>
            <Select
                defaultValue={field}
                onChange={(e) => setValue(e.target.value)}
                value={value}
            >
                {isEmpty && <option value="">---</option>}
                {multipleValueOptions?.map((item) => (
                    <option value={item.value} key={item.value}>
                        {item.label}
                    </option>
                ))}
            </Select>
            <ButtonGroup justifyContent="center" size="sm" mx="2">
                <IconButton
                    aria-label="check"
                    icon={<CheckIcon />}
                    onClick={async (e) => {
                        await onSubmit(value);
                        setIsEditing.off();
                    }}
                />
                <IconButton
                    aria-label="close"
                    icon={<CloseIcon />}
                    onClick={(e) => {
                        setValue(field);
                        setIsEditing.off();
                    }}
                />
            </ButtonGroup>
        </>
    ) : (
        <>
            {selectedValue?.label}
            <IconButton
                aria-label="edit"
                size="sm"
                icon={<EditIcon />}
                onClick={setIsEditing.on}
            />
        </>
    );
};
