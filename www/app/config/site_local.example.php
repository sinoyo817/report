<?php

return [
    'Site' => [
        "Settings" => [
            "Release" => false,
            "Mail" => [
                "Admin" => [
                    "fromAddress" => '__ADMIN_FROM_MAIL__',
                    "toAddress" => '__ADMIN_TO_MAIL__',
                ],
            ],
            "baseUrl" => "http://127.0.0.1:32772",
            "baseAdminUrl" => "http://127.0.0.1:32772/adsys/",
            "GoogleTagManagerId" => "",
            "Fess" => [
                'label' => '',
            ],
            "reCAPTCHA" => [
                "siteKey" => "",
                "secretKey" => "",
            ],
        ],
    ],
];
