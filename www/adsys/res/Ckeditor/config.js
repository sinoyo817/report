/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function (config) {
  config.language = 'ja';
  config.allowedContent = true;
  config.extraAllowedContent = 'cite; address; q';

  config.indentOffset = 1;
  config.indentUnit = 'em';
  config.fontSize_sizes =
    '8/0.8rem;9/0.9rem;10/1.0rem;11/1.1rem;12/1.2rem;14/1.4rem;16/1.6rem;18/1.8rem;20/2.0rem;22/2.2rem;24/2.4rem;26/2.6rem;28/2.8rem;36/3.6rem;48/4.8rem;72/7.2rem;';

  //config.fontSize_sizes = '1/1;2/2;3/3;4/4;5/5;6/6;7/7';
  config.contentsCss = [
    '//maxcdn.bootstrapcdn.com/font-awesome/4.6.2/css/font-awesome.min.css',
    '/css/common.css',
  ];
  config.bodyClass = 'wysiwyg';
  config.stylesSet = 'custom_styles';

  config.shiftEnterMode = CKEDITOR.ENTER_BR;

  // https://ckeditor.com/old/forums/CKEditor/Complete-list-of-toolbar-items
  config.toolbar = [
    { name: 'document', items: ['Source', 'NewPage', 'Templates'] },
    {
      name: 'clipboard',
      items: [
        'Cut',
        'Copy',
        'Paste',
        'PasteText',
        '-',
        'Undo',
        'Redo',
        '-',
        'Find',
        'Replace',
        'SelectAll',
      ],
    },
    {
      name: 'basicstyles',
      items: [
        'Bold',
        'Underline',
        'Italic',
        'Strike',
        'Subscript',
        'Superscript',
        '-',
        'CopyFormatting',
        'RemoveFormat',
      ],
    },
    {
      name: 'paragraph',
      items: [
        'NumberedList',
        'BulletedList',
        '-',
        'Outdent',
        'Indent',
        '-',
        'Blockquote',
      ],
    },
    {
      name: 'justify',
      items: [
        'JustifyLeft',
        'JustifyCenter',
        'JustifyRight',
        'JustifyBlock',
        'Language',
      ],
    },
    { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
    { name: 'files', items: ['Image'] },
    { name: 'insert', items: ['HorizontalRule', 'PageBreak', 'Styles'] },
    { name: 'styles', items: ['TextColor', 'BGColor', 'FontSize'] },
    { name: 'others', items: ['ShowBlocks', 'Maximize'] },
  ];

  config.skin = 'coara';
  config.resize_enabled = true;
  config.resize_dir = 'both';
  config.width = '100%'; //横幅
  config.height = '150px'; //高さ
  config.resize_minWidth = 350;
  config.language_list = [
    'ja:日本語:ltr',
    'en:英語:ltr',
    'ar:アラビア語:rtl',
    'es:スペイン語:ltr',
    'fr:フランス語:ltr',
    'ru:ロシア語:ltr',
    'zh-cmn-Hans:簡体字:ltr',
    'zh-cmn-Hant:繁体字:ltr',
    'ko:韓国語:ltr',
  ];
  config.justifyClasses = [
    'txt-left',
    'txt-center',
    'txt-right',
    'txt-justify',
  ];

  config.templates_files = ['/res/Ckeditor/templates/templates.js'];

  config.colorButton_colors = 'CF5D4E,454545,FFF,CCC,DDD,CCEAEE';
  config.colorButton_enableAutomatic = false;
  config.colorButton_enableMore = false;

  config.keystrokes = [[CKEDITOR.CTRL + 65, 'selectAll']];

  // KCFinder(デフォルトでは)
  config.filebrowserBrowseUrl = '/adsys/res/kcfinder/browse.php?type=files';
  config.filebrowserImageBrowseUrl =
    '/adsys/res/kcfinder/browse.php?type=images';
  config.filebrowserUploadUrl = '/adsys/res/kcfinder/upload.php?type=files';
  config.filebrowserImageUploadUrl =
    '/adsys/res/kcfinder/upload.php?type=images';

  // 太字をstrongからemに
  config.coreStyles_bold = {
    element: 'em',
    attributes: {},
  };

  // 斜体をspanのstyleで
  config.coreStyles_italic = {
    element: 'i',
  };

  // 下線ボタン(u)を赤太字用ボタン(strong)に変更
  // ja.jsも下線->赤太字に修正。ボタン画像はicons.png,icons_hidpi.pngにて。
  config.coreStyles_underline = {
    element: 'strong',
    attributes: {},
  };
};

CKEDITOR.stylesSet.add('custom_styles', [
  { name: '標準', element: 'p', attributes: { class: '' } },
  { name: '見出し1', element: 'h1', attributes: { class: '' } },
  { name: '見出し2', element: 'h2', attributes: { class: '' } },
  { name: '見出し3', element: 'h3', attributes: { class: '' } },
  { name: '見出し4', element: 'h4', attributes: { class: '' } },
  { name: '見出し5', element: 'h5', attributes: { class: '' } },
  { name: '見出し6', element: 'h6', attributes: { class: '' } },
  { name: '字下げ', element: 'p', attributes: { class: 'txt-indent' } },
  {
    name: '文字間隔 小',
    element: 'span',
    attributes: { class: 'font-space-small' },
  },
  {
    name: '文字間隔 中',
    element: 'span',
    attributes: { class: 'font-space-medium' },
  },
  {
    name: '文字間隔 大',
    element: 'span',
    attributes: { class: 'font-space-large' },
  },
  {
    name: '文字間隔 特大',
    element: 'span',
    attributes: { class: 'font-space-xlarge' },
  },
  { name: '出典', element: 'cite', attributes: {} },
  { name: '短い引用', element: 'q', attributes: {} },
  { name: 'アドレス', element: 'address', attributes: {} },
]);

CKEDITOR.on('dialogDefinition', function (ev) {
  var dialogName = ev.data.name;
  var dialogDefinition = ev.data.definition;

  if (dialogName == 'templates') {
    var infoTab = dialogDefinition.getContents('selectTpl');
    infoTab.get('chkInsertOpt')['default'] = '';
  }

  if (dialogName == 'table' || dialogName == 'tableProperties') {
    dialogDefinition.removeContents('advanced');

    // Get a reference to the 'Table Info' tab.
    var infoTab = dialogDefinition.getContents('info');

    var textWidth = infoTab.get('txtWidth');
    textWidth['default'] = '100%';
    //infoTab.remove( 'txtWidth');
    infoTab.remove('txtHeight');
    infoTab.remove('txtSummary');
    //infoTab.remove( 'txtCaption');
    infoTab.remove('cmbAlign');
    infoTab.remove('txtBorder');
    //infoTab.remove( 'selHeaders');
    infoTab.remove('txtCellSpace');
    infoTab.remove('txtCellPad');
  }

  // 画像のダイアログコンテンツから、任意のメニュータブを削除する
  if (dialogName == 'image' || dialogName == 'imageProperties') {
    dialogDefinition.removeContents('advanced');
    dialogDefinition.removeContents('Link');
    dialogDefinition.removeContents('Upload');
  }

  // リンクのダイアログコンテンツから、任意のメニュータブを削除する
  if (dialogName == 'link' || dialogName == 'linkProperties') {
    dialogDefinition.removeContents('advanced');
    dialogDefinition.removeContents('upload');
  }
});

// インスタンス準備完了時
CKEDITOR.on('instanceReady', function (ev) {
  ev.editor.on('beforeCommandExec', function (event) {
    if (
      event.data.name == 'superscript' &&
      event.editor.commands.subscript.state == 1
    ) {
      event.editor.execCommand('subscript');
    } else if (
      event.data.name == 'subscript' &&
      event.editor.commands.superscript.state == 1
    ) {
      event.editor.execCommand('superscript');
    }
  });
});
