export type CategoryUseType = "single" | "multi" | "no";
export type BasicDisplayShowType = "on" | "off";
export type FreepageCustomPathType = { dir: string; path: string };
export type SettingLocaleType = {
    locale: string;
    title: string;
    "html-lang": string;
};

export type SettingsTopicType = {
    category: CategoryUseType;
    thumbnail: BasicDisplayShowType;
    summary: BasicDisplayShowType;
    accesibility: BasicDisplayShowType;
    paging: number;
    approve: BasicDisplayShowType;
};

export type SettingsEventType = {
    category: CategoryUseType;
    area: CategoryUseType;
    // thumbnail: BasicDisplayShowType;
    // summary: BasicDisplayShowType;
    accesibility: BasicDisplayShowType;
    paging: number;
    approve: BasicDisplayShowType;
};

export type SettingsFreepageType = {
    customCss: FreepageCustomPathType[];
    customJs: FreepageCustomPathType[];
    accesibility: BasicDisplayShowType;
    approve: BasicDisplayShowType;
};

export type SettingsContactType = {
    title: BasicDisplayShowType;
    email: BasicDisplayShowType;
    address: BasicDisplayShowType;
    tel: BasicDisplayShowType;
    gender: BasicDisplayShowType;
    birthday: BasicDisplayShowType;
    genre: BasicDisplayShowType;
    file: BasicDisplayShowType;
    summary: BasicDisplayShowType;
};
export type SettingsGeneralType = {
    site: string;
    description: string;
    keywords: string;
    og_image: string;
    noimage: string;
    locale: string;
    og_locale: string;
    fromMail: string;
    toMail: string;
    fromName: string;
    toName: string;
    newIconLimit: number;
};

export type SettingsOptionType = {
    i18n: string;
    locale: SettingLocaleType[];
};

export type SettingTopicFormValuesType = SettingsTopicType;
export type SettingEventFormValuesType = SettingsEventType;
export type SettingFreepageFormValuesType = SettingsFreepageType;
export type SettingContactFormValuesType = SettingsContactType;
export type SettingGeneralFormValuesType = SettingsGeneralType;
export type SettingOptionFormValuesType = SettingsOptionType;

export type SettingMetaType = {
    master_category_use: Record<CategoryUseType, string>;
    basic_display_show: Record<BasicDisplayShowType, string>;
};
