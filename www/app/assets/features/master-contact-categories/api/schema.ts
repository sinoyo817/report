import { FormFieldType } from "@/types";
import { MasterContactCategoryFormValuesType } from "../types";

export const masterContactCategoriesModel = "MasterContactCategories";

export const masterContactCategoriesFields: FormFieldType<MasterContactCategoryFormValuesType>[] =
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
