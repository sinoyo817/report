import {
    BaseEntityType,
    BlockFieldsType,
    DefaultLocaleType,
    UnkownUtilityType,
} from "@/types";
import { ThemeTypings } from "@chakra-ui/react";

export const subDir = `${VITE_SUBDIR}`;
export const adminPrefix = `${subDir ? `/${subDir}` : ""}/${VITE_PREFIX}/`;

export type ApprovalStatusOptionType = {
    status: string;
    title: string;
    sequence: number;
    forSelect: boolean;
    forSearch: boolean;
    colorScheme?: ThemeTypings["colorSchemes"];
    alertTitle?: string;
    alertBody?: string;
    alertButton?: string;
};

export type UtilityEntityType = UnkownUtilityType & BaseEntityType;

export type StatusChangeResoponseType = {
    status: boolean;
    data?: UtilityEntityType[];
};

export const cakeTranslateInputPrefix = "_translations";
export const defaultLocale: DefaultLocaleType = "ja";

export const blockFields: BlockFieldsType = {
    default: [
        {
            title: "見出し(大)",
            defaultValues: {
                type: "header01",
                value01: "",
            },
        },
        {
            title: "見出し(小)",
            defaultValues: {
                type: "header02",
                value01: "",
            },
        },
        {
            title: "文章",
            defaultValues: {
                type: "text",
                value01: "",
            },
        },
        {
            title: "画像1つ",
            defaultValues: {
                type: "image",
                file01_id: "",
                value01: "",
                value02: "",
                value03: "",
                value04: "0",
            },
        },
        {
            title: "画像２つ",
            defaultValues: {
                type: "image_two",
                file01_id: "",
                value01: "",
                value02: "",
                value03: "",
                value04: "0",
                file02_id: "",
                value11: "",
                value12: "",
                value13: "",
                value14: "0",
            },
        },
        {
            title: "画像と文章",
            defaultValues: {
                type: "image_text",
                file01_id: "",
                value01: "",
                value02: "",
                value03: "",
                value04: "0",
                value11: "",
                value12: "R",
            },
        },
        {
            title: "リンク",
            defaultValues: {
                type: "link",
                value01: "",
                value02: "",
                value03: 0,
            },
        },
        {
            title: "ファイル",
            defaultValues: {
                type: "file",
                file01_id: "",
                value01: "",
            },
        },
        {
            title: "文章(見たまま)",
            defaultValues: {
                type: "wysiwyg",
                value01: "",
            },
        },
        {
            title: "埋め込み(iframe)",
            defaultValues: {
                type: "iframe",
                value01: "",
                value02: "",
            },
        },
    ],
    sub_image: [
        {
            title: "サブ画像",
            defaultValues: {
                type: "image",
                file01_id: "",
                value01: "",
                value02: "",
                value03: "",
                value04: "0",
            },
        },
    ],
    related_link: [
        {
            title: "関連リンク",
            defaultValues: {
                type: "link",
                value01: "",
                value02: "",
                value03: 0,
            },
        },
    ],
    related_file: [
        {
            title: "関連ファイル",
            defaultValues: {
                type: "file",
                file01_id: "",
                value01: "",
            },
        },
    ],
    works: [
        {
            title: "予算コード",
            defaultValues: {
                type: "work",
                value01: "",
            },
        },
    ],
};
