export type CharacterChangeOptionsType = {
    full_width_kana: string;
    half_width_alphanumeric: string;
    alphabetic_characters: string;
    half_width_blank: string;
};

export const characterChangeOptions: CharacterChangeOptionsType = {
    full_width_kana: "半角カナ → 全角カナ",
    half_width_alphanumeric: "全角数字 → 半角数字",
    alphabetic_characters: "全角英字 → 半角英字",
    half_width_blank: "全角空白 → 半角空白",
};

export type AccessibilityCheckOptionsType = {
    kana: string;
    prohibited: string;
    gif: string;
    emSpace: string;
    dependent: string;
    deadLink: string;
    alphanumeric: string;
    notAlt: string;
};

export const accessibilityCheckOptions: AccessibilityCheckOptionsType = {
    kana: "半角カナの検出",
    prohibited: "禁則文字の検出",
    gif: "GIF画像の点滅注意喚起",
    emSpace: "文字の全角空白の検出",
    dependent: "機種依存文字の検出",
    deadLink: "リンク切れの検出",
    alphanumeric: "全角英数字の検出",
    notAlt: "代替テキスト無の画像の検出",
};

export type AccessiblityResoponseType = {
    status: boolean;
};
