import { FormFieldType } from "@/types";
import { MasterTopicCategoryFormValuesType } from "../types";

export const masterTopicCategoriesModel = "MasterTopicCategories";

export const masterTopicCategoriesFields: FormFieldType<MasterTopicCategoryFormValuesType>[] =
    [
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
            id: "class",
            formType: "input",
            label: "class",
            placeholder: "classを入力してください",
            defaultValue: "",
        },
    ];
