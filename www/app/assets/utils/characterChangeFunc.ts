export const toFullZenkana = (elm: string) => {
    const beforeStr = [
        "ｧ",
        "ｨ",
        "ｩ",
        "ｪ",
        "ｫ",
        "ｬ",
        "ｭ",
        "ｮ",
        "ｯ",
        "ｰ",
        "ｳﾞ",
        "ｶﾞ",
        "ｷﾞ",
        "ｸﾞ",
        "ｹﾞ",
        "ｺﾞ",
        "ｻﾞ",
        "ｼﾞ",
        "ｽﾞ",
        "ｾﾞ",
        "ｿﾞ",
        "ﾀﾞ",
        "ﾁﾞ",
        "ﾂﾞ",
        "ﾃﾞ",
        "ﾄﾞ",
        "ﾊﾞ",
        "ﾋﾞ",
        "ﾌﾞ",
        "ﾍﾞ",
        "ﾎﾞ",
        "ﾊﾟ",
        "ﾋﾟ",
        "ﾌﾟ",
        "ﾍﾟ",
        "ﾎﾟ",
        "ｱ",
        "ｲ",
        "ｳ",
        "ｴ",
        "ｵ",
        "ｶ",
        "ｷ",
        "ｸ",
        "ｹ",
        "ｺ",
        "ｻ",
        "ｼ",
        "ｽ",
        "ｾ",
        "ｿ",
        "ﾀ",
        "ﾁ",
        "ﾂ",
        "ﾃ",
        "ﾄ",
        "ﾅ",
        "ﾆ",
        "ﾇ",
        "ﾈ",
        "ﾉ",
        "ﾊ",
        "ﾋ",
        "ﾌ",
        "ﾍ",
        "ﾎ",
        "ﾏ",
        "ﾐ",
        "ﾑ",
        "ﾒ",
        "ﾓ",
        "ﾔ",
        "ﾕ",
        "ﾖ",
        "ﾗ",
        "ﾘ",
        "ﾙ",
        "ﾚ",
        "ﾛ",
        "ﾜ",
        "ｦ",
        "ﾝ",
    ];
    const afterStr = [
        "ァ",
        "ィ",
        "ゥ",
        "ェ",
        "ォ",
        "ャ",
        "ュ",
        "ョ",
        "ッ",
        "ー",
        "ヴ",
        "ガ",
        "ギ",
        "グ",
        "ゲ",
        "ゴ",
        "ザ",
        "ジ",
        "ズ",
        "ゼ",
        "ゾ",
        "ダ",
        "ヂ",
        "ヅ",
        "デ",
        "ド",
        "バ",
        "ビ",
        "ブ",
        "ベ",
        "ボ",
        "パ",
        "ピ",
        "プ",
        "ペ",
        "ポ",
        "ア",
        "イ",
        "ウ",
        "エ",
        "オ",
        "カ",
        "キ",
        "ク",
        "ケ",
        "コ",
        "サ",
        "シ",
        "ス",
        "セ",
        "ソ",
        "タ",
        "チ",
        "ツ",
        "テ",
        "ト",
        "ナ",
        "ニ",
        "ヌ",
        "ネ",
        "ノ",
        "ハ",
        "ヒ",
        "フ",
        "ヘ",
        "ホ",
        "マ",
        "ミ",
        "ム",
        "メ",
        "モ",
        "ヤ",
        "ユ",
        "ヨ",
        "ラ",
        "リ",
        "ル",
        "レ",
        "ロ",
        "ワ",
        "ヲ",
        "ン",
    ];
    let fullStr = elm;
    for (let i = 0; i < beforeStr.length; i++) {
        fullStr = fullStr.replace(new RegExp(beforeStr[i], "g"), afterStr[i]);
    }
    return fullStr;
};

export const halfWidthAlphanumeric = (elm: string) => {
    return elm.replace(/[０-９]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
};

export const toHanKaku = (elm: string) => {
    return elm.replace(/[Ａ-Ｚａ-ｚ]/g, function (s) {
        console.log(s);
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
};

export const toHalfWidthBlank = (elm: string) => {
    return elm.replace(/\u3000/g, " ");
};

export const isHankakuKana = (s: string) => {
    return !!s.match(/[ｦ-ﾟ]/g);
};
export const isAlphanumeric = (s: string) => {
    return !!s.match(/[０-９]/g);
};
export const isAlphabeticCharacters = (s: string) => {
    return !!s.match(/[Ａ-Ｚａ-ｚ]/g);
};
export const isHalfWidthBlank = (s: string) => {
    return !!s.match(/\u3000/g);
};
