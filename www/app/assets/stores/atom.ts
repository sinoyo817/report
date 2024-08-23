import { AuthStateType } from "@/features/auth";
import { FreepageShowType } from "@/features/freepages";
import { GlobalFilterParamType } from "@/types";
import { atom } from "recoil";

export const RecoilAtomKeys = {
    AUTH: "auth",
    PAGE_TITLE: "pageTitle",
    SHOW_LAYOUT: "showLayout",
    FILTER_STATE: "filterState",
    FREEPAGE_SHOW_STATE: "freepageShowState",
} as const;

export type RecoilAtomKeysType =
    (typeof RecoilAtomKeys)[keyof typeof RecoilAtomKeys];

export const authAtom = atom<AuthStateType>({
    key: RecoilAtomKeys.AUTH,
    default: null,
});

export const pageTitleAtom = atom<string>({
    key: RecoilAtomKeys.PAGE_TITLE,
    default: "",
});

export const showLayoutAtom = atom<boolean>({
    key: RecoilAtomKeys.SHOW_LAYOUT,
    default: true,
});

export const filterStateAtom = atom<GlobalFilterParamType>({
    key: RecoilAtomKeys.FILTER_STATE,
    default: undefined,
});

export const freepageShowStateAtom = atom<FreepageShowType>({
    key: RecoilAtomKeys.FREEPAGE_SHOW_STATE,
    default: "tree",
});
