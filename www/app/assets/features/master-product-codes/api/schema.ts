
import { FormFieldType } from "@/types";
import { MasterProductCodeFormValuesType } from "../types";


export const masterProductCodesModel = "MasterProductCodes";


export const masterProductCodesFields: FormFieldType<MasterProductCodeFormValuesType>[] = [
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
        id: "code",
        formType: "input",
        label: "予算コード",
        placeholder: "予算コードを入力してください",
        defaultValue: "",
        formControlOptions: { isRequired: true },
        rule: { required: "予算コードを入力してください" },
    },
    {
        id: "can",
        formType: "input",
        label: "CANコード",
        placeholder: "CANコードを入力してください",
        defaultValue: "",
        // formControlOptions: { isRequired: true },
        // rule: { required: "CANコードを入力してください" },
    },


];

