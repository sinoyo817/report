import { AdminType } from "@/features/admins/types";
import { FileType } from "@/features/files";
import {
    CheckboxProps,
    FormControlProps,
    InputProps,
    RadioProps,
    SelectProps,
    TextareaProps,
} from "@chakra-ui/react";
import { FilePondOptions } from "filepond";
import {
    HTMLAttributes,
    HTMLInputTypeAttribute,
    InputHTMLAttributes,
    SelectHTMLAttributes,
    TextareaHTMLAttributes,
} from "react";
import { DateTimePickerProps } from "react-flatpickr";
import { FieldValues, Path, PathValue, RegisterOptions } from "react-hook-form";

export type AllApprovalStatusListsType =
    | "published"
    | "unpublished"
    | "draft"
    | "pending"
    | "remand"
    | "suspend"
    | "deleted"
    | "copied"
    | "published_req"
    | "unpublished_req";
export type PublicParamListsType = "published" | "unpublished";
export type StatusParamListsType = "published" | "unpublished" | "draft";

export type StringUtilityType = Record<string, string>;

export type UnkownUtilityType = Record<string, unknown>;

export type MetaUtilityType<
    T extends StringUtilityType = Record<string, string>
> = Record<string, T[] | T>;

export type BaseEntityType = {
    id: string;
    status: StatusParamListsType;
    public: PublicParamListsType;
    created: string;
    modified: string;
    searchtext?: string;
    cid: number;
    is_translation?: boolean;
    locale?: string;
};

export type CoreBaseBlockEntityType = {
    id?: string;
    foreign_id?: string;
    sequence: number;
    type: string;
    model: string;
    locale?: string;
    created?: string;
    modified?: string;
};

export type BaseBlockEntityType = CoreBaseBlockEntityType & {
    file01_id?: string;
    file02_id?: string;
    file03_id?: string;
    file_paths?: string;
    file01?: FileType;
    file02?: FileType;
    file03?: FileType;
    value01?: string | number;
    value02?: string | number;
    value03?: string | number;
    value04?: string | number;
    value05?: string | number;
    value06?: string | number;
    value07?: string | number;
    value08?: string | number;
    value09?: string | number;
    value10?: string | number;
    value11?: string | number;
    value12?: string | number;
    value13?: string | number;
    value14?: string | number;
    value15?: string | number;
    value16?: string | number;
    value17?: string | number;
    value18?: string | number;
    value19?: string | number;
    value20?: string | number;
    value21?: string | number;
    value22?: string | number;
    value23?: string | number;
    value24?: string | number;
    value25?: string | number;
    value26?: string | number;
    value27?: string | number;
    value28?: string | number;
    value29?: string | number;
    value30?: string | number;
    _translations?: Record<string, Omit<BaseBlockEntityType, "_translations">>;
};

export type BlockFieldsType = Record<
    string,
    {
        title: string;
        defaultValues: Partial<BaseBlockEntityType>;
    }[]
>;

export type BaseBlockPropsType<S extends BaseBlockEntityType> =
    CommonFieldOptionType & {
        id: string;
        index: number;
        field: Record<keyof S, string>;
    };

export type BaseMetadataEntityType = {
    id: string;
    description: string;
    keywords: string;
    file: FileType;
};

export type ResoponseCollectionType = {
    count: number;
    first: string;
    last: string;
    next: string;
    prev: string;
    pages: number;
    total: number;
    url: string;
};

export type IgnoreFormFieldsType =
    | "searchtext"
    | "id"
    | "status"
    | "public"
    | "created"
    | "modified"
    | "cid";

type FormType =
    | "input"
    | "checkbox"
    | "multiCheckbox"
    | "radio"
    | "select"
    | "date"
    | "datetime"
    | "time"
    | "datePeriod"
    | "textarea"
    | "wysiwyg"
    | "image"
    | "file"
    | "group"
    | "passwordConfirm"
    | "block"
    | "simpleBlock"
    | "remoteSelect"
    | "remoteRadio"
    | "remoteCheckbox"
    | "remoteMultiCheckbox";

export type OptionOptionType = {
    label?: string;
    value: number | string;
};

export type FormFieldType<T extends FieldValues> = {
    id: Path<T>;
    formType: FormType;
    label?: React.ReactNode;
    placeholder?: string;
    defaultValue?: PathValue<T, Path<T>>;
    helpText?: React.ReactNode;
    inputType?: HTMLInputTypeAttribute | undefined;
    inputOptions?: Omit<InputProps, "label"> &
        InputHTMLAttributes<T> & {
            "data-accessibility"?: string;
            "data-accessibility-target"?: string;
        };
    textareaOptions?: Omit<TextareaProps, "label"> &
        TextareaHTMLAttributes<T> & {
            "data-accessibility"?: string;
            "data-accessibility-target"?: string;
        };
    selectOptions?: Omit<SelectProps, "label"> & SelectHTMLAttributes<T>;
    radioOptions?: Omit<RadioProps, "label"> & InputHTMLAttributes<T>;
    checkboxOptions?: Omit<CheckboxProps, "label"> & InputHTMLAttributes<T>;
    checkboxValueOption?: OptionOptionType;
    checkboxOnDisplayText?: string;
    checkboxOffDisplayText?: string;
    multipleValueOptions?: OptionOptionType[];
    remoteDataKey?: string;
    remoteDataIndexKey?: string;
    remoteDataValueKey?: string;
    flatpickerOptions?: DateTimePickerProps;
    formControlOptions?: Omit<FormControlProps, "label" | "children">;
    blockType?: string;
    blockModel?: string;
    group?: FormFieldType<T>[];
    periodGroup?: { start: FormFieldType<T>; end: FormFieldType<T> };
    periodConnector?: string;
    groupLabel?: string;
    periodLabel?: string;
    wysiwygFilesField?: Path<T>;
    fileUploadOptions?: FilePondOptions;
    rule?: Omit<
        RegisterOptions<T>,
        "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
    >;
    blockLimit?: number;
    fileFindModel?: string | string[];
    ignoreFindModel?: boolean;
    showIgnoreWysiwygClass?: boolean;
    ignoreImageCaption?: boolean;
    ignoreImageUrl?: boolean;
    locale?: string;
    ignoreForeign?: boolean;
    useDefaultLocaleData?: boolean;
};

export type CommonFieldOptionType = {
    isConfirm?: boolean;
    model: string;
    locale?: string;
};

export type MetadataType = {
    file_id?: string;
    description?: string;
    keywords?: string;
    model: string;
};

export type CommonFilterParamType = UnkownUtilityType & {
    q?: string;
    page?: number;
    limit?: number;
    sort?: string;
    direction?: string;
    status?: string;
};

export type GlobalFilterParamType = Record<string, CommonFilterParamType>;

export type ConfirmResponseType = {
    view?: string;
    status: boolean;
};

export type ResponseValidationType = Record<string, StringUtilityType>;

export type BaseSelectOptions = {
    id: string;
    title: string;
};

export type CommonAnswerOptions = {
    yes: string;
    no: string;
};

export type ChronosDateTimeType = {
    date: string;
    timezone_type: number;
    timezone: string;
};

export type SimpleBlockEntityType = {
    id: string;
    sequence: number;
    title: string;
};

export type ApprovalRemandType = {
    summary: string;
    created: string;
    create_admin: AdminType;
} & Omit<BaseEntityType, "status" | "public">;

export type SearchPropsType = {
    defaultValue?: CommonFilterParamType;
    setPagination: React.Dispatch<React.SetStateAction<number>>;
    setContentsFilter: (param: Record<string, unknown>) => void;
};

export type DefaultLocaleType = string;

export type LocaleType = {
    locale: string;
    title: string;
};

export type LocalesType = LocaleType[];

export type LocaleSettingType = {
    locales: LocalesType;
};
