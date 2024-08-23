import { cakeTranslateInputPrefix, defaultLocale } from "@/config";

export type getBaseFormFieldNameType = {
    field: string;
    isForeign?: boolean;
};

export const getBaseFormFieldName = (props: getBaseFormFieldNameType) => {
    const { field, isForeign } = props;

    const fieldName = isForeign
        ? `${cakeTranslateInputPrefix}.${defaultLocale}.${field}`
        : `${field}`;

    return fieldName;
};
