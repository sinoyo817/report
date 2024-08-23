<?php

/**
 *
 * @param \Medii\File\Config Filesystem
 *
 **/

return [
    'Filesystem' => [
        'settings' => [
            'fullBaseUrl' => 'http://127.0.0.1:32772',
            'mode' => 'symlink',
            'basePath' => '/',
        ],
        'csv' => [ //非公開領域
            'adapter' => 'League\Flysystem\Local\LocalFilesystemAdapter', // default
            'adapterArguments' => [TMP . 'csv'],
            'filesystemArguments' => [
                'visibility' => 'public',
                'directory_visibility' => 'public',
            ],
            'formatter' => '\App\Utility\Formatters\CsvFormatter'
        ],
    ]
];
