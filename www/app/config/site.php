<?php

use Cake\Routing\Router;

return [
    'Site' => [
        "Settings" => [
            "MenuHeaderKey" => [
                'updatesKey' => 'updates',
                'masterSettingKey' => 'masterSetting',
                'authAccountKey' => 'authAccount',
            ],
            "MenuHeader" => [
                'updates' => '定期更新',
                'masterSetting' => '設定・マスタ',
                'authAccount' => 'アカウント管理',
            ],
            "ContentsKey" => [
                "topicsKey" => "Topics",
                "eventsKey" => "Events",
                "freepagesKey" => "Freepages",
                "topImagesKey" => "TopImages",
                "bunnersKey" => "Bunners",
                // "contactsKey" => "Contacts",
                "adminsKey" => "Admins",
                "masterProductCodesKey" => "MasterProductCodes",
                "masterWorkCodesKey" => "MasterWorkCodes",
                "masterTopicCategoriesKey" => "MasterTopicCategories",
                "masterEventCategoriesKey" => "MasterEventCategories",
                "masterContactCategoriesKey" => "MasterContactCategories",
            ],
            "ContentsList" => [
                "Topics" => "お知らせ",
                // "Events" => "イベント",
                // "Freepages" => "フリーページ",
                // "TopImages" => "TOPイメージ",
                // "Bunners" => "バナー",
                // "Contacts" => "お問い合わせ",
                "Admins" => "管理者",
                "MasterProductCodes" => "予算コード",
                "MasterWorkCodes" => "作業内容",
                // "MasterTopicCategories" => "お知らせカテゴリ",
                // "MasterEventCategories" => "観光地・イベントカテゴリ",
                // "MasterContactCategories" => "お問い合わせカテゴリ",
            ],
            "MenuList" => [
                "updates" => [
                    "Topics",
                    "Events",
                    "Freepages",
                    "TopImages",
                    "Bunners",
                    // "Contacts",
                ],
                "masterSetting" => [
                    "MasterProductCodes",
                    "MasterWorkCodes",
                    "MasterTopicCategories",
                    "MasterEventCategories",
                    "MasterContactCategories",
                ],
                "authAccount" => [
                    "Admins",
                ],
            ],
            "CategoryUseTypeKey" => [
                "singleKey" => "single",
                "multiKey" => "multi",
                "noKey" => "no",
            ],
            "CategoryUseType" => [
                "single" => "単一選択",
                "multi" => "複数選択",
                "no" => "利用しない",
            ],
            "BasicDisplayShowKey" => [
                "onKey" => "on",
                "offKey" => "off",
            ],
            "BasicDisplayShow" => [
                "on" => "ON",
                "off" => "OFF",
            ],
            "CommonAnswerKey" => [
                "yesKey" => "yes",
                "noKey" => "no",
            ],
            "CommonAnswer" => [
                "yes" => "YES",
                "no" => "NO",
            ],
            "FreepageTypeKey" => [
                "directoryKey" => "directory",
                "documentKey" => "document",
            ],
            "FreepageType" => [
                "directory" => "階層",
                "document" => "ページ",
            ],
            "Reset" => [
                "Migration" => [
                    'rollback' => [
                        ["target" => "20221012054757"], //Topicsまで
                        ["date" => "20221001", "plugin" => "Medii/File"], //全対象
                        ["date" => "20221001", "plugin" => "Medii/Block"], //全対象
                        ["date" => "20221001", "plugin" => "Medii/Metadata"], //全対象
                        ["date" => "20221001", "plugin" => "Medii/Recommend"], //全対象
                    ],
                    'i18nRollback' => [
                        ["date" => "20221001", "source" => "Migrations/i18n"], //全対象
                        ["date" => "20221001", "source" => "Migrations/i18n", "plugin" => "Medii/Block"], //全対象
                        ["date" => "20221001", "source" => "Migrations/i18n", "plugin" => "Medii/Metadata"], //全対象
                    ],
                    'migrate' => [
                        [], //Admin以外全対象
                        ["plugin" => "Medii/File"], //全対象
                        ["plugin" => "Medii/Block"], //全対象
                        ["plugin" => "Medii/Metadata"], //全対象
                        ["plugin" => "Medii/Recommend"], //全対象
                    ],
                    'i18nMigrate' => [
                        ["source" => "Migrations/i18n"], //多言語全対象
                        ["source" => "Migrations/i18n", "plugin" => "Medii/Block"], //全対象
                        ["source" => "Migrations/i18n", "plugin" => "Medii/Metadata"], //全対象
                    ],
                ],
            ],
        ],
    ],
];
