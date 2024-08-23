import { FormFieldType } from "@/types";
import { MasterEventCategoryFormValuesType } from "../types";

export const masterEventCategoriesModel = "MasterEventCategories";

export const masterEventCategoriesFields: FormFieldType<MasterEventCategoryFormValuesType>[] =
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
    ];
