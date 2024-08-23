import { CKEditorConfig, CKEditor } from "ckeditor4-react";
import { adminPrefix, subDir } from "./settings";

export const ckeditorTypeConfig: CKEditorConfig = {
    // editorConfig: {
    language: "ja",
    allowedContent: true,
    extraAllowedContent: "cite; address; q",
    extraPlugins: "autogrow",
    autoGrow_minHeight: 200,
    autoGrow_maxHeight: 600,
    autoGrow_bottomSpace: 50,

    indentOffset: 1,
    indentUnit: "em",
    fontSize_sizes:
        "8/0.8rem;9/0.9rem;10/1.0rem;11/1.1rem;12/1.2rem;14/1.4rem;16/1.6rem;18/1.8rem;20/2.0rem;22/2.2rem;24/2.4rem;26/2.6rem;28/2.8rem;36/3.6rem;48/4.8rem;72/7.2rem;",

    //fontSize_sizes:'1/1;2/2;3/3;4/4;5/5;6/6;7/7',
    contentsCss: [
        "//maxcdn.bootstrapcdn.com/font-awesome/4.6.2/css/font-awesome.min.css",
        `${subDir ? `/${subDir}` : ""}/css/common.css`,
    ],
    bodyClass: "wysiwyg",
    stylesSet: [
        { name: "標準", element: "p", attributes: { class: "" } },
        { name: "見出し(大)", element: "h2", attributes: { class: "" } },
        { name: "見出し(小)", element: "h3", attributes: { class: "" } },
        { name: "見出し4", element: "h4", attributes: { class: "" } },
        { name: "見出し5", element: "h5", attributes: { class: "" } },
        { name: "見出し6", element: "h6", attributes: { class: "" } },
        {
            name: "字下げ",
            element: "p",
            attributes: { class: "txt-indent" },
        },
        {
            name: "文字間隔 小",
            element: "span",
            attributes: { class: "font-space-small" },
        },
        {
            name: "文字間隔 中",
            element: "span",
            attributes: { class: "font-space-medium" },
        },
        {
            name: "文字間隔 大",
            element: "span",
            attributes: { class: "font-space-large" },
        },
        {
            name: "文字間隔 特大",
            element: "span",
            attributes: { class: "font-space-xlarge" },
        },
        { name: "出典", element: "cite", attributes: {} },
        { name: "短い引用", element: "q", attributes: {} },
        { name: "アドレス", element: "address", attributes: {} },
    ],

    shiftEnterMode: 2,

    // https://ckeditor.com/old/forums/CKEditor/Complete-list-of-toolbar-items
    toolbar: [
        { name: "document", items: ["Source", "NewPage", "Templates"] },
        {
            name: "clipboard",
            items: [
                "Cut",
                "Copy",
                "Paste",
                "PasteText",
                "-",
                "Undo",
                "Redo",
                "-",
                "Find",
                "Replace",
                "SelectAll",
            ],
        },
        {
            name: "basicstyles",
            items: [
                "Bold",
                "Underline",
                "Italic",
                "Strike",
                "Subscript",
                "Superscript",
                "-",
                "CopyFormatting",
                "RemoveFormat",
            ],
        },
        {
            name: "paragraph",
            items: [
                "NumberedList",
                "BulletedList",
                "-",
                "Outdent",
                "Indent",
                "-",
                "Blockquote",
            ],
        },
        {
            name: "justify",
            items: [
                "JustifyLeft",
                "JustifyCenter",
                "JustifyRight",
                "JustifyBlock",
                "Language",
            ],
        },
        { name: "links", items: ["Link", "Unlink", "Anchor"] },
        { name: "files", items: ["Image"] },
        {
            name: "insert",
            items: ["HorizontalRule", "PageBreak", "Styles"],
        },
        { name: "styles", items: ["TextColor", "BGColor", "FontSize"] },
        { name: "others", items: ["ShowBlocks", "Maximize"] },
    ],

    skin: "coara",
    resize_enabled: true,
    resize_dir: "both",
    width: "100%", //横幅
    height: "150px", //高さ
    resize_minWidth: 350,
    language_list: [
        "ja:日本語:ltr",
        "en:英語:ltr",
        "ar:アラビア語:rtl",
        "es:スペイン語:ltr",
        "fr:フランス語:ltr",
        "ru:ロシア語:ltr",
        "zh-cmn-Hans:簡体字:ltr",
        "zh-cmn-Hant:繁体字:ltr",
        "ko:韓国語:ltr",
    ],
    justifyClasses: ["txt-left", "txt-center", "txt-right", "txt-justify"],

    templates_files: [`${adminPrefix}res/Ckeditor/templates/templates.js`],

    colorButton_colors: "CF5D4E,454545,FFF,CCC,DDD,CCEAEE",
    colorButton_enableAutomatic: false,
    colorButton_enableMore: false,

    keystrokes: [[0x110000 + 65, "selectAll"]],

    // 太字をstrongからemに
    coreStyles_bold: {
        element: "em",
        attributes: {},
    },

    // 斜体をspanのstyleで
    coreStyles_italic: {
        element: "i",
    },

    // 下線ボタン(u)を赤太字用ボタン(strong)に変更
    // ja.jsも下線->赤太字に修正。ボタン画像はicons.png,icons_hidpi.pngにて。
    coreStyles_underline: {
        element: "strong",
        attributes: {},
    },
    // },

    // 順序つきリストと順序なしリスト
    on: {
        // インスタンス準備完了時
        instanceReady: function(ev: any) {    
            // OFFの時もexecが走るので
            ev.editor.on('afterCommandExec', function(event: any) {
                if (event.data.name === 'numberedlist') {
                    // 順序付きリスト
                    if (event.editor.getCommand('numberedlist').state === CKEDITOR.TRISTATE_ON) { // CKEDITOR.TRISTATE_ONは1
                        // liststyleのdialog表示
                        event.editor.openDialog('numberedListStyle');
                    }
                } else if (event.data.name === 'bulletedlist') {
                     // 順序なしリスト
                    if (event.editor.getCommand('bulletedlist').state === CKEDITOR.TRISTATE_ON) {
                        event.editor.openDialog('bulletedListStyle');
                    }
                }
            });

            //順序つきリストと順序なしリスト
            ev.editor.on('dialogDefinition', function(ev: any) {
                var dialogName = ev.data.name;
                var dialogDefinition = ev.data.definition;

                if (dialogName === 'numberedListStyle' || dialogName === 'bulletedListStyle') {
                    var infoTab = dialogDefinition.getContents('info').elements.find((el: any) => el.id === 'type');

                    infoTab.setup = function() {
                        if (dialogName === 'numberedListStyle') {
                            this.setValue('decimal');
                        } else if (dialogName === 'bulletedListStyle') {
                            this.setValue('disc');
                        }
                    };

                    dialogDefinition.onCancel = function() {
                        if (dialogName === 'numberedListStyle' && ev.editor.getCommand('numberedlist').state === CKEDITOR.TRISTATE_ON) {
                            ev.editor.getCommand('numberedlist').setState(CKEDITOR.TRISTATE_OFF);
                            ev.editor.getCommand('numberedlist').exec();
                        } else if (dialogName === 'bulletedListStyle' && ev.editor.getCommand('bulletedlist').state === CKEDITOR.TRISTATE_ON) {
                            ev.editor.getCommand('bulletedlist').setState(CKEDITOR.TRISTATE_OFF);
                            ev.editor.getCommand('bulletedlist').exec();
                        }
                    };
                }
            });
        }
    }
};
