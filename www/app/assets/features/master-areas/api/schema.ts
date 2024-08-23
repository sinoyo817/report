import { FormFieldType } from "@/types";
import { MasterAreaFormValuesType } from "../types";

export const masterAreasModel = "MasterAreas";

export const masterAreasFields: FormFieldType<MasterAreaFormValuesType>[] = [
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
