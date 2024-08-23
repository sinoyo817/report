<?php

/**
 * Routes configuration.
 *
 * In this file, you set up routes to your controllers and their actions.
 * Routes are very important mechanism that allows you to freely connect
 * different URLs to chosen controllers and their actions (functions).
 *
 * It's loaded within the context of `Application::routes()` method which
 * receives a `RouteBuilder` instance `$routes` as method argument.
 *
 * CakePHP(tm) : Rapid Development Framework (https://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 * @link          https://cakephp.org CakePHP(tm) Project
 * @license       https://opensource.org/licenses/mit-license.php MIT License
 */

use App\Routing\Route\FreepagesRoute;
use Cake\Core\Configure;
use Cake\I18n\I18n;
use Cake\Routing\Route\DashedRoute;
use Cake\Routing\RouteBuilder;
use Cake\Routing\Router;
use Cake\Utility\Hash;
use Medii\StaticPages\Routing\Route\StaticPagesRoute;
use MixerApi\Rest\Lib\AutoRouter;
use MixerApi\Rest\Lib\Route\ResourceScanner;

return static function (RouteBuilder $routes) {
    /*
     * The default class to use for all routes
     *
     * The following route classes are supplied with CakePHP and are appropriate
     * to set as the default:
     *
     * - Route
     * - InflectedRoute
     * - DashedRoute
     *
     * If no call is made to `Router::defaultRouteClass()`, the class used is
     * `Route` (`Cake\Routing\Route\Route`)
     *
     * Note that `Route` does not do any inflections on URLs which will result in
     * inconsistently cased URLs when used with `{plugin}`, `{controller}` and
     * `{action}` markers.
     */
    $routes->setRouteClass(DashedRoute::class);

    $routes->scope('/', function (RouteBuilder $builder) {

        if (Configure::read('CustomSettings.Option.i18n') === "on") {
            $defaultLocale = I18n::getDefaultLocale();
            $locale = implode('|', Hash::extract(Configure::read('CustomSettings.Option.locale'), "{n}[locale!={$defaultLocale}].locale"));

            $builder->connect('/{locale}/', ['controller' => 'Pages', 'action' => 'index'])
                ->setPatterns([
                    'locale' => $locale,
                ])
                ->setPass(['locale'])
                ->setPersist(['locale']);


            $builder->connect('/{locale}/{controller}/detail/{id}', ['action' => 'detail'])
                ->setPatterns([
                    'id' => '[a-zA-Z0-9_\-]+',
                    'locale' => $locale,
                ])
                ->setPass(['id', 'locale'])
                ->setPersist(['locale']);

            $builder->connect('/{locale}/*', ['plugin' => 'Medii/StaticPages', 'controller' => 'StaticPages', 'action' => 'view'], ['routeClass' => StaticPagesRoute::class, 'path' => '.*'])
                ->setPatterns([
                    'locale' => $locale,
                ])
                ->setPass(['locale'])
                ->setPersist(['locale']);

            $builder->connect('/{locale}/{path}', ['controller' => 'FreepageDocuments', 'action' => 'detail'], ['routeClass' => FreepagesRoute::class,])
                ->setPatterns([
                    'path' => '[a-zA-Z0-9_\-\/\.]+',
                    'locale' => $locale,
                ])->setPass(['path', 'locale'])
                ->setPersist(['locale']);

            $builder->connect('/{locale}/{controller}', ['action' => 'index'])
                ->setPatterns([
                    'locale' => $locale,
                ])
                ->setPass(['locale'])
                ->setPersist(['locale']);

            $builder->connect('/{locale}/{controller}/{action}/*', [])
                ->setPatterns([
                    'locale' => $locale,
                ])
                ->setPass(['locale'])
                ->setPersist(['locale']);
        }

        /*
         * Here, we are connecting '/' (base path) to a controller called 'Pages',
         * its action called 'display', and we pass a param to select the view file
         * to use (in this case, templates/Pages/home.php)...
         */
        $builder->connect('/', ['controller' => 'Pages', 'action' => 'index']);

        $builder->connect('/adsys', ['controller' => 'Pages', 'action' => 'index', 'prefix' => 'Adsys']);
        $builder->connect('/adsys-mng', ['controller' => 'Pages', 'action' => 'index', 'prefix' => 'AdsysMng']);

        $builder->connect('/{controller}/detail/{id}', ['action' => 'detail'])
            ->setPatterns([
                'id' => '[a-zA-Z0-9_\-]+',
            ])->setPass(['id']);

        $builder->connect('/*', ['plugin' => 'Medii/StaticPages', 'controller' => 'StaticPages', 'action' => 'view'], ['routeClass' => StaticPagesRoute::class, 'path' => '.*']);
        $builder->connect('/{path}', ['controller' => 'FreepageDocuments', 'action' => 'detail'], ['routeClass' => FreepagesRoute::class,])
            ->setPatterns([
                'path' => '[a-zA-Z0-9_\-\/\.]+',
            ])->setPass(['path']);

        $builder->fallbacks();
    });


    $routes->prefix('Adsys', function (RouteBuilder $builder) {
        $builder->setExtensions(['json']);


        $builder->connect(
            '/admins/logout',
            ['controller' => 'Admins', 'action' => 'logout'],
        );

        /*
        * Here, we are connecting '/adsys' (base path) to a SwaggerBake
        * @see https://github.com/cnizzardini/cakephp-swagger-bake
        */
        // $builder->connect('/swagger', ['plugin' => 'SwaggerBake', 'controller' => 'Swagger', 'action' => 'index']);

        $builder->prefix('Api', function (RouteBuilder $apiBuilder) {

            $apiBuilder->resources('Admins', [
                'only' => ['auth', 'auth-edit', 'auth-edit-confirm', 'auth-password-edit'],
                'map' => [
                    'auth' => [
                        'method' => 'GET',
                        'action' => 'auth',
                    ],
                    'auth-edit' => [
                        'method' => 'POST',
                        'action' => 'auth-edit',
                    ],
                    'auth-edit-confirm' => [
                        'method' => 'POST',
                        'action' => 'auth-edit-confirm',
                    ],
                    'auth-password-edit' => [
                        'method' => 'POST',
                        'action' => 'auth-password-edit',
                    ],
                ]
            ]);
            $apiBuilder->resources('Events', [
                'only' => ['only-edit'],
                'map' => [
                    'only-edit' => [
                        'method' => 'POST',
                        'action' => 'only-edit',
                        'path' => '/only-edit/{id}',
                    ],
                ]
            ]);
            $apiBuilder->resources('FreepageDirectories', [
                'only' => ['all', 'sequence'],
                'map' => [
                    'all' => [
                        'method' => 'GET',
                        'action' => 'all',
                    ],
                    'sequence' => [
                        'method' => 'POST',
                        'action' => 'sequence',
                        'path' => '/sequence/{id}',
                    ],
                ]
            ]);
            $apiBuilder->resources('Accessibilities', [
                'only' => ['link', 'gif'],
                'map' => [
                    'link' => [
                        'method' => 'POST',
                        'action' => 'link',
                    ],
                    'gif' => [
                        'method' => 'POST',
                        'action' => 'gif',
                    ],
                ]
            ]);
            $apiBuilder->resources('CommonSettings', [
                'only' => ['locale-settings'],
                'map' => [
                    'locale-settings' => [
                        'method' => 'GET',
                        'action' => 'locale-settings',
                    ],
                ]
            ]);
            $apiBuilder->resources('{controller}', [
                'only' => ['index', 'view', 'create', 'update', 'status', 'confirm-add', 'confirm-edit', 'preview', 'metadata', 'csv-download'],
                'map' => [
                    'status' => [
                        'method' => 'POST',
                        'action' => 'status',
                    ],
                    'confirm-add' => [
                        'method' => 'POST',
                        'action' => 'confirm',
                        'path' => '/confirm',
                    ],
                    'confirm-edit' => [
                        'method' => 'POST',
                        'action' => 'confirm',
                        'path' => '/confirm/{id}',
                    ],
                    'preview' => [
                        'method' => 'GET',
                        'action' => 'preview',
                        'path' => '/preview/{id}',
                    ],
                    'metadata' => [
                        'method' => 'GET',
                        'action' => 'metadata',
                    ],
                    'csv-download' => [
                        'method' => 'GET',
                        'action' => 'csv-download',
                    ],
                ]
            ]);
        });

        $builder->resources('Admins', [
            'only' => ['login', 'me'],
            'map' => [
                'login' => [
                    'method' => ['GET', 'POST'],
                    'action' => 'login',
                ],
                'me' => [
                    'method' => 'GET',
                    'action' => 'me',
                ],
            ]
        ]);

        $builder->connect(
            '/{dir}',
            ['controller' => 'Pages', 'action' => 'index'],
        )->setPatterns([
            'dir' => '[a-zA-Z0-9-_]+',
        ])
            ->setPass(['dir']);

        $builder->connect(
            '/{dir}/{file}/**',
            ['controller' => 'Pages', 'action' => 'index'],
        )->setPatterns([
            'dir' => '[a-zA-Z0-9-_]+',
            'file' => '[a-zA-Z0-9-_]*',
        ])
            ->setPass(['dir', 'file']);

        $builder->fallbacks();
    });

    $routes->prefix('AdsysMng', function (RouteBuilder $builder) {
        $builder->setExtensions(['json']);


        $builder->connect(
            '/admins/logout',
            ['controller' => 'Admins', 'action' => 'logout'],
        );

        /*
        * Here, we are connecting '/adsys' (base path) to a SwaggerBake
        * @see https://github.com/cnizzardini/cakephp-swagger-bake
        */
        // $builder->connect('/swagger', ['plugin' => 'SwaggerBake', 'controller' => 'Swagger', 'action' => 'index']);

        $builder->prefix('Api', function (RouteBuilder $apiBuilder) {



            $apiBuilder->resources('{controller}', [
                'only' => ['index', 'view', 'create', 'update', 'status', 'confirm-add', 'confirm-edit', 'preview', 'metadata', 'csv-download'],
                'map' => [
                    'status' => [
                        'method' => 'POST',
                        'action' => 'status',
                    ],
                    'confirm-add' => [
                        'method' => 'POST',
                        'action' => 'confirm',
                        'path' => '/confirm',
                    ],
                    'confirm-edit' => [
                        'method' => 'POST',
                        'action' => 'confirm',
                        'path' => '/confirm/{id}',
                    ],
                    'preview' => [
                        'method' => 'GET',
                        'action' => 'preview',
                        'path' => '/preview/{id}',
                    ],
                    'metadata' => [
                        'method' => 'GET',
                        'action' => 'metadata',
                    ],
                    'csv-download' => [
                        'method' => 'GET',
                        'action' => 'csv-download',
                    ],
                ]
            ]);

            $apiBuilder->resources('Settings', [
                'only' => [
                    'topics-view',
                    'topics-update',
                    'events-view',
                    'events-update',
                    'freepages-view',
                    'freepages-update',
                    'contacts-view',
                    'contacts-update',
                    'general-view',
                    'general-update',
                    'option-view',
                    'option-update',
                ],
                'map' => [
                    'topics-view' => [
                        'method' => 'GET',
                        'action' => 'topics-view',
                    ],
                    'topics-update' => [
                        'method' => 'POST',
                        'action' => 'topics-update',
                    ],
                    'events-view' => [
                        'method' => 'GET',
                        'action' => 'events-view',
                    ],
                    'events-update' => [
                        'method' => 'POST',
                        'action' => 'events-update',
                    ],
                    'freepages-view' => [
                        'method' => 'GET',
                        'action' => 'freepages-view',
                    ],
                    'freepages-update' => [
                        'method' => 'POST',
                        'action' => 'freepages-update',
                    ],
                    'contacts-view' => [
                        'method' => 'GET',
                        'action' => 'contacts-view',
                    ],
                    'contacts-update' => [
                        'method' => 'POST',
                        'action' => 'contacts-update',
                    ],
                    'general-view' => [
                        'method' => 'GET',
                        'action' => 'general-view',
                    ],
                    'general-update' => [
                        'method' => 'POST',
                        'action' => 'general-update',
                    ],
                    'option-view' => [
                        'method' => 'GET',
                        'action' => 'option-view',
                    ],
                    'option-update' => [
                        'method' => 'POST',
                        'action' => 'option-update',
                    ],
                ]
            ]);

            $apiBuilder->resources('Approvals', [
                'only' => [
                    'access-view',
                    'access-update',
                ],
                'map' => [
                    'access-view' => [
                        'method' => 'GET',
                        'action' => 'access-view',
                    ],
                    'access-update' => [
                        'method' => 'POST',
                        'action' => 'access-update',
                    ],

                ]
            ]);
            $apiBuilder->resources('Resets', [
                'only' => [
                    'reset',
                ],
                'map' => [
                    'reset' => [
                        'method' => 'POST',
                        'action' => 'reset',
                    ],

                ]
            ]);

            $apiBuilder->resources('CommonSettings', [
                'only' => ['locale-settings'],
                'map' => [
                    'locale-settings' => [
                        'method' => 'GET',
                        'action' => 'locale-settings',
                    ],
                ]
            ]);
        });



        $builder->resources('Admins', [
            'only' => ['login', 'me'],
            'map' => [
                'login' => [
                    'method' => ['GET', 'POST'],
                    'action' => 'login',
                ],
                'me' => [
                    'method' => 'GET',
                    'action' => 'me',
                ],
            ]
        ]);

        $builder->connect(
            '/{dir}',
            ['controller' => 'Pages', 'action' => 'index'],
        )->setPatterns([
            'dir' => '[a-zA-Z0-9-_]+',
        ])
            ->setPass(['dir']);

        $builder->connect(
            '/{dir}/{file}/**',
            ['controller' => 'Pages', 'action' => 'index'],
        )->setPatterns([
            'dir' => '[a-zA-Z0-9-_]+',
            'file' => '[a-zA-Z0-9-_]*',
        ])
            ->setPass(['dir', 'file']);

        $builder->fallbacks();
    });
};
