<?php

/**
 *
 */

return [
    'CustomSettings' => [
        "Topics" => [
            "category" => 'single',
            "thumbnail" => 'on',
            "summary" => 'on',
            "accesibility" => 'off',
            "paging" => 12,
            "approve" => 'off',
        ],
        "Events" => [
            "category" => 'multi',
            "area" => 'multi',
            // "thumbnail" => 'on',
            // "summary" => 'on',
            "accesibility" => 'off',
            "paging" => 12,
            "approve" => 'off',
        ],
        "Freepages" => [
            "customCss" => [],
            "customJs" => [],
            "accesibility" => 'off',
            "approve" => 'off',
        ],
        "Contacts" => [
            "title" => 'on',
            "email" => 'on',
            "address" => 'on',
            "tel" => 'on',
            "gender" => 'on',
            "birthday" => 'on',
            "genre" => 'on',
            "file" => 'on',
            "summary" => 'on',
        ],
        "General" => [
            "site" => "",
            "description" => "",
            "keywords" => "",
            "og_image" => '/img/common/ogp.png',
            "noimage" => '/img/common/noimage.jpg',
            "locale" => "ja",
            "og_locale" => "ja_JP",
            "fromMail" => "",
            "toMail" => "",
            "fromName" => "",
            "toName" => "",
            "newIconLimit" => 14,
        ],
        "Option" => [
            'i18n' => "off",
            'locale' => [
                ["locale" => "ja", "title" => "日本語", "html-lang" => "ja"],
                // ["locale" => "en", "title" => "英語", "html-lang" => "en"],
                // ["locale" => "zh", "title" => "簡体字", "html-lang" => "zh-cmn-Hans"],
                // ["locale" => "tw", "title" => "繁体字", "html-lang" => "zh-cmn-Hant"],
                // ["locale" => "ko", "title" => "韓国語", "html-lang" => "ko"],
            ],
        ],
    ],
];
