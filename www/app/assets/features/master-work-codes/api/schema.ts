
import { FormFieldType } from "@/types";
import { MasterWorkCodeFormValuesType } from "../types";


export const masterWorkCodesModel = "MasterWorkCodes";


export const masterWorkCodesFields: FormFieldType<MasterWorkCodeFormValuesType>[] = [
    {
        id: "title",
        formType: "input",
        label: "作業内容",
        placeholder: "作業内容を入力してください",
        defaultValue: "",
        formControlOptions: { isRequired: true },
        rule: { required: "作業内容を入力してください" },
    },
];

