import { FormFieldType } from "@/types";
import { TopicFormValuesType } from "../types";

export const topicsModel = "Topics";

export const topicsFields: FormFieldType<TopicFormValuesType>[] = [
    {
        id: "title",
        formType: "input",
        label: "タイトル",
        placeholder: "タイトルを入力してください",
        defaultValue: "",
        formControlOptions: { isRequired: true },
        rule: { required: "タイトルを入力してください" },
    },
    {
        id: "published",
        formType: "date",
        label: "公開日",
        placeholder: "公開日を入力してください",
        defaultValue: new Date().toLocaleDateString().replaceAll("/", "-"),
        formControlOptions: { isRequired: true },
        rule: { required: "公開日を入力してください" },
    },
    {
        id: "start_date",
        formType: "datePeriod",
        periodGroup: {
            start: {
                id: "start_date",
                formType: "date",
                defaultValue: "",
            },
            end: {
                id: "end_date",
                formType: "date",
                defaultValue: "",
            },
        },
        periodConnector: "~",
        periodLabel: "公開期間",
    },
    {
        id: "url",
        formType: "input",
        label: "タイトルリンクURL",
        placeholder: "タイトルリンクURLを入力してください",
        defaultValue: "",
        inputType: "url",
        rule: {
            pattern: {
                value: /^https?:\/\/(.+?)\./,
                message: "URLの形式を確認してください",
            },
        },
        inputOptions: {
            "data-accessibility": "text,link",
        },
    },
    {
        id: "url_is_blank",
        formType: "checkbox",
        label: "外部リンク",
        defaultValue: "0",
        checkboxValueOption: { value: "1" },
        checkboxOnDisplayText: "有効",
    },
    {
        id: "metadata",
        formType: "group",
        defaultValue: "",
        group: [
            {
                id: "metadata.description",
                formType: "textarea",
                label: "デスクリプション",
                placeholder: "デスクリプションを入力してください",
                defaultValue: "",
            },
            {
                id: "metadata.keywords",
                formType: "textarea",
                label: "キーワード",
                placeholder: "キーワードを入力してください",
                defaultValue: "",
            },
            {
                id: "metadata.file_id",
                formType: "image",
                label: "OGP画像(SNS投稿画像)",
                defaultValue: "",
            },
            {
                id: "metadata.model",
                formType: "input",
                inputType: "hidden",
                defaultValue: "Topics",
            },
        ],
        groupLabel: "メタデータ",
    },
    {
        id: "blocks",
        formType: "block",
        label: "ブロック",
        defaultValue: [],
        blockType: undefined,
        blockModel: topicsModel,
    },
];
