import { checkGif, checkLink } from "@/features/misc/api/accessibilityCheck";
import { axios } from "@/lib/axios";
import { AxiosError } from "axios";

export type AccessibilityCheckTargetStringType = {
    before?: string;
    target: string;
    after?: string;
};

export type AccessibilityCheckMessageType = {
    target?: AccessibilityCheckTargetStringType[];
    message: string;
};

export type AccessibilityCheckMethodsPropType = {
    value?: string;
    editor?: CKEDITOR.editor;
    targetValue?: string;
};

export type AccessibilityCheckMethodType = (
    props: AccessibilityCheckMethodsPropType
) => Promise<AccessibilityCheckMessageType[] | undefined>;

export type AccessibilityCheckMethodsType = {
    [x in string]: {
        type: string;
        method: AccessibilityCheckMethodType;
        checkOther?: boolean;
    };
};

export const accessibilityCheckMethods: AccessibilityCheckMethodsType = {
    kana: {
        //半角カナの検出
        type: "text",
        method: async ({ value, editor, targetValue }) => {
            const ret: AccessibilityCheckMessageType[] = [];
            const target = match("[ｦ-ﾟ]+", value);
            if (target) {
                ret.push({
                    target: target,
                    message: "半角カナが使用されています",
                });
                return ret;
            }
        },
    },
    prohibited: {
        //禁則文字の検出
        type: "text",
        method: async ({ value, editor, targetValue }) => {
            const check = (value?: string) => {
                if (!value) {
                    return;
                }

                const ret: AccessibilityCheckMessageType[] = [];
                const targetFirst = match(
                    "^(<(\"[^\"]*\"|'[^']*'|[^'\">])*>)?(、|。|，|．|・|：|；|？|！|ヽ|ヾ|ゝ|ゞ|々|ー|’|”|）|〕|］|｝|〉|》|」|』|】|°|′|″|℃|¢|％)+",
                    value
                );

                if (targetFirst) {
                    ret.push({
                        target: targetFirst,
                        message: "行頭に禁則文字が入力されています",
                    });
                }

                const targetLast = match(
                    "(‘|“|（|〔|［|｛|〈|《|「|『|【|￥|＄)+(</(\"[^\"]*\"|'[^']*'|[^'\">])*>)?(\n|\r\n|\r|s)?$",
                    value
                );

                if (targetLast) {
                    ret.push({
                        target: targetLast,
                        message: "行末に禁則文字が入力されています",
                    });
                }

                return ret;
            };

            if (editor) {
                let ret: AccessibilityCheckMessageType[] = [];
                const p = editor.document.$.querySelectorAll("p");
                if (p) {
                    for (let i = 0; i < p.length; i++) {
                        const el = p[i];
                        if (el) {
                            const text = el.innerText;
                            if (text) {
                                const checked = check(text);
                                if (checked) {
                                    ret = [...ret, ...checked];
                                }
                            }
                        }
                    }
                }
                if (ret.length) {
                    return ret;
                } else {
                    return;
                }
            } else {
                return check(value);
            }
        },
    },
    gif: {
        //GIF画像の点滅注意喚起
        type: "image",
        method: async ({ value, editor, targetValue }) => {
            const ret: AccessibilityCheckMessageType[] = [];
            if (!value) {
                return;
            }

            const check = async (value: string) => {
                try {
                    const data = await checkGif({ data: { file_id: value } });
                    if (!data.status) {
                        const ret: AccessibilityCheckMessageType = {
                            message: "アニメーションgifが登録されています",
                        };
                        return ret;
                    }
                } catch (e) {
                    //
                }
            };

            if (editor) {
                const ret: AccessibilityCheckMessageType[] = [];

                const img = editor.document.$.querySelectorAll("img");
                if (img) {
                    for (let i = 0; i < img.length; i++) {
                        const el = img[i];
                        if (el) {
                            const src = el.getAttribute("src");
                            if (src) {
                                const checked = await check(src);
                                if (checked) {
                                    ret.push(checked);
                                }
                            }
                        }
                    }
                }

                return ret;
            } else {
                const checked = await check(value);

                if (checked) {
                    ret.push(checked);
                    return ret;
                }
            }
        },
    },
    emSpace: {
        //文字の全角空白の検出
        type: "text",
        method: async ({ value, editor, targetValue }) => {
            const ret: AccessibilityCheckMessageType[] = [];
            const target = match("[　]+", value);
            if (target) {
                ret.push({
                    target: target,
                    message: "全角空白が入力されています",
                });
                return ret;
            }
        },
    },
    dependent: {
        //機種依存文字の検出
        type: "text",
        method: async ({ value, editor, targetValue }) => {
            const ret: AccessibilityCheckMessageType[] = [];
            const target = match(
                "[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡㍻〝〟№㏍℡㊤㊥㊦㊧㊨㈱㈲㈹㍾㍽㍼]+",
                value
            );
            if (target) {
                ret.push({
                    target: target,
                    message: "機種依存文字が入力されています",
                });
                return ret;
            }
        },
    },
    deadLink: {
        //リンク切れの検出
        type: "link",
        method: async ({ value, editor, targetValue }) => {
            const ret: AccessibilityCheckMessageType[] = [];
            if (!value) {
                return;
            }

            const check = async (value: string) => {
                try {
                    const data = await checkLink({ data: { url: value } });

                    if (!data.status) {
                        const ret: AccessibilityCheckMessageType = {
                            target: [
                                { target: value.replace(/(<([^>]+)>)/gi, "") },
                            ],
                            message: "リンクのURLが正しくありません",
                        };
                        return ret;
                    }
                } catch (e) {
                    //
                }
            };

            if (editor) {
                const a = editor.document.$.querySelectorAll("a");
                if (a) {
                    for (let i = 0; i < a.length; i++) {
                        const el = a[i];
                        if (el) {
                            const url = el.href;
                            if (url) {
                                const checked = await check(url);
                                if (checked) {
                                    ret.push(checked);
                                }
                            }
                        }
                    }
                }

                return ret;
            } else {
                const checked = await check(value);

                if (checked) {
                    ret.push(checked);
                    return ret;
                }
            }
        },
    },
    alphanumeric: {
        //全角英数字の検出
        type: "text",
        method: async ({ value, editor, targetValue }) => {
            const ret: AccessibilityCheckMessageType[] = [];
            const target = match("[ａ-ｚＡ-Ｚ０-９]+", value);
            if (target) {
                ret.push({
                    target: target,
                    message: "全角英数字が入力されています",
                });
                return ret;
            }
        },
    },
    notAlt: {
        //代替テキスト無の画像の検出
        type: "alt",
        checkOther: true,
        method: async ({ value, editor, targetValue }) => {
            if (editor) {
                const ret: AccessibilityCheckMessageType[] = [];
                const img = editor.document.$.querySelectorAll("img");
                if (img) {
                    for (let i = 0; i < img.length; i++) {
                        const el = img[i];
                        if (el) {
                            const alt = el.alt;
                            if (!alt) {
                                const checked = {
                                    message: "代替テキストが設定されていません",
                                };
                                if (checked) {
                                    ret.push(checked);
                                }
                            }
                        }
                    }
                }

                return ret;
            } else {
                const ret: AccessibilityCheckMessageType[] = [];
                if (value) {
                    if (!targetValue) {
                        ret.push({
                            message: "代替テキストが設定されていません",
                        });
                        return ret;
                    }
                }
            }
        },
    },
};

const match = (
    pattern: string,
    value?: string
): AccessibilityCheckTargetStringType[] | void => {
    if (!value) {
        return;
    }

    const reg = new RegExp(pattern, "g");

    const matches = value.matchAll(reg);

    const previews: AccessibilityCheckTargetStringType[] = [];
    for (const match of matches) {
        const max = 20;

        // console.log(
        //     `Found ${match[0]} start=${match.index} end=${
        //         match.index + match[0].length
        //     }.`
        // );

        if (match[0].length < max) {
            const index = match.index;
            if (index !== undefined) {
                const rest = max - match[0].length;

                const before = value.substring(0, index);
                const after = value.substring(index + match[0].length);

                let b = Math.min(before.length, Math.ceil(rest / 2));
                const a = Math.min(after.length, rest - b);

                b = Math.min(before.length, rest - a);

                previews.push({
                    before: before.replace(/(<([^>]+)>)/gi, "").substring(-b),
                    target: match[0].replace(/(<([^>]+)>)/gi, ""),
                    after: after.substring(0, a).replace(/(<([^>]+)>)/gi, ""),
                });
            }
        } else {
            previews.push({
                target: match[0]
                    .substring(0, max - 2)
                    .replace(/(<([^>]+)>)/gi, ""),
            });
        }
    }

    if (previews.length) {
        return previews;
    }
};
