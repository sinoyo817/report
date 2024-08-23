import { defaultLocale } from "@/config";

export type getIsForeignType = {
    locale?: string;
};

export const getIsForeign = (props: getIsForeignType) => {
    const { locale } = props;

    return locale !== undefined && locale !== defaultLocale;
};
