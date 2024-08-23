/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// Register a templates definition set named "default".
CKEDITOR.addTemplates('default', {
  // The name of sub folder which hold the shortcut preview images of the
  // templates.
  imagesPath: './templates/img/',

  // The templates definitions.
  templates: [
    {
      title: '一行目が見出しのテーブル',
      image: 'template_table01.jpg',
      description:
        'A template that defines two columns, each one with a title, and some text.',
      html:
        '\n<div class="table-scroll"><table>' +
        '<caption>テーブルのキャプション</caption>' +
        '<thead>' +
        '<tr>' +
        '<th scope="col">見出し</th>' +
        '<th scope="col">見出し</th>' +
        '<th scope="col">見出し</th>' +
        '<th scope="col">見出し</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr>' +
        '<td>1</td>' +
        '<td>2</td>' +
        '<td>3</td>' +
        '<td>4</td>' +
        '</tr>' +
        '<tr>' +
        '<td>1</td>' +
        '<td>2</td>' +
        '<td>3</td>' +
        '<td>4</td>' +
        '</tr>' +
        '</tbody>' +
        '<tfoot>' +
        '<tr>' +
        '<td>フッタ</td>' +
        '<td>フッタ</td>' +
        '<td>フッタ</td>' +
        '<td>フッタ</td>' +
        '</tr>' +
        '</tfoot>' +
        '</table></div>' +
        '\n ' +
        '\n ',
    },
    {
      title: '一列目が見出しのテーブル',
      image: 'template_table02.jpg',
      description: 'A title with some text and a table.',
      html:
        '\n<div class="table-scroll"><table>' +
        '<caption>テーブルのキャプション</caption>' +
        '<tbody>' +
        '<tr>' +
        '<th>見出し</th>' +
        '<td>1</td>' +
        '<td>2</td>' +
        '<td>3</td>' +
        '</tr>' +
        '<tr>' +
        '<th>見出し</th>' +
        '<td>1</td>' +
        '<td>2</td>' +
        '<td>3</td>' +
        '</tr>' +
        '<tr>' +
        '<th>見出し</th>' +
        '<td>1</td>' +
        '<td>2</td>' +
        '<td>3</td>' +
        '</tr>' +
        '</tbody>' +
        '<tfoot>' +
        '<tr>' +
        '<td>フッタ</td>' +
        '<td>フッタ</td>' +
        '<td>フッタ</td>' +
        '<td>フッタ</td>' +
        '</tr>' +
        '</tfoot>' +
        '</table></div>' +
        '\n ' +
        '\n ',
    },
    {
      title: '一行目と一列目が見出しのテーブル',
      image: 'template_table03.jpg',
      description: 'A title with some text and a table.',
      html:
        '\n<div class="table-scroll"><table>' +
        '<caption>テーブルのキャプション</caption>' +
        '<thead>' +
        '<tr>' +
        '<th scope="col">見出し</th>' +
        '<th scope="col">見出し</th>' +
        '<th scope="col">見出し</th>' +
        '<th scope="col">見出し</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr>' +
        '<th scope="row">見出し</th>' +
        '<td>1</td>' +
        '<td>2</td>' +
        '<td>3</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">見出し</th>' +
        '<td>1</td>' +
        '<td>2</td>' +
        '<td>3</td>' +
        '</tr>' +
        '</tbody>' +
        '<tfoot>' +
        '<tr>' +
        '<td>フッタ</td>' +
        '<td>フッタ</td>' +
        '<td>フッタ</td>' +
        '<td>フッタ</td>' +
        '</tr>' +
        '</tfoot>' +
        '</table></div>' +
        '\n ' +
        '\n ',
    },
    {
      title: '順序のある横並びリスト',
      image: 'template_ol_h.jpg',
      description: 'A title with some text and a table.',
      html:
        '\n<ol class="horizontal-list" style="list-style-type: decimal;">' +
        '<li>順序のある横並びリスト</li>' +
        '<li>順序のある横並びリスト</li>' +
        '<li>順序のある横並びリスト</li>' +
        '<li>順序のある横並びリスト</li>' +
        '</ol>' +
        '\n ' +
        '\n ',
    },
    {
      title: '順序のない横並びリスト',
      image: 'template_ul_h.jpg',
      description: 'A title with some text and a table.',
      html:
        '\n<ul class="horizontal-list" style="list-style-type: disc;">' +
        '<li>順序のない横並びリスト</li>' +
        '<li>順序のない横並びリスト</li>' +
        '<li>順序のない横並びリスト</li>' +
        '<li>順序のない横並びリスト</li>' +
        '</ul>' +
        '\n ' +
        '\n ',
    },
    {
      title: '定義リスト(縦並び)',
      image: 'template_dl_v.jpg',
      description: 'A title with some text and a table.',
      html:
        '\n<dl>' +
        '<dt>定義する言葉</dt>' +
        '<dd>ここに定義の説明が入ります。</dd>' +
        '<dt>定義する言葉</dt>' +
        '<dd>ここに定義の説明が入ります。</dd>' +
        '<dt>定義する言葉</dt>' +
        '<dd>ここに定義の説明が入ります。</dd>' +
        '<dt>定義する言葉</dt>' +
        '<dd>ここに定義の説明が入ります。</dd>' +
        '</dl>' +
        '\n ' +
        '\n ',
    },
    {
      title: '定義リスト(横並び)',
      image: 'template_dl_h.jpg',
      description: 'A title with some text and a table.',
      html:
        '\n<dl class="horizontal-list">' +
        '<dt>定義する言葉</dt>' +
        '<dd>ここに定義の説明が入ります。</dd>' +
        '<dt>定義する言葉</dt>' +
        '<dd>ここに定義の説明が入ります。</dd>' +
        '<dt>定義する言葉</dt>' +
        '<dd>ここに定義の説明が入ります。</dd>' +
        '<dt>定義する言葉</dt>' +
        '<dd>ここに定義の説明が入ります。</dd>' +
        '</dl>' +
        '\n ' +
        '\n ',
    },
  ],
});
