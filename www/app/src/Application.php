<?php

declare(strict_types=1);

/**
 * CakePHP(tm) : Rapid Development Framework (https://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 * @link      https://cakephp.org CakePHP(tm) Project
 * @since     3.3.0
 * @license   https://opensource.org/licenses/mit-license.php MIT License
 */

namespace App;

use App\Policy\RequestPolicy;
use Authentication\AuthenticationService;
use Authentication\AuthenticationServiceInterface;
use Authentication\AuthenticationServiceProviderInterface;
use Authentication\Identifier\IdentifierInterface;
use Authentication\Middleware\AuthenticationMiddleware;
use Authorization\AuthorizationService;
use Authorization\AuthorizationServiceInterface;
use Authorization\AuthorizationServiceProviderInterface;
use Authorization\Middleware\AuthorizationMiddleware;
use Authorization\Middleware\RequestAuthorizationMiddleware;
use Authorization\Policy\MapResolver;
use Authorization\Policy\OrmResolver;
use Authorization\Policy\ResolverCollection;
use Cake\Core\Configure;
use Cake\Core\ContainerInterface;
use Cake\Datasource\FactoryLocator;
use Cake\Error\Middleware\ErrorHandlerMiddleware;
use Cake\Http\BaseApplication;
use Cake\Http\Middleware\BodyParserMiddleware;
use Cake\Http\Middleware\CsrfProtectionMiddleware;
use Cake\Http\MiddlewareQueue;
use Cake\Http\ServerRequest;
use Cake\ORM\Locator\TableLocator;
use Cake\Routing\Middleware\AssetMiddleware;
use Cake\Routing\Middleware\RoutingMiddleware;
use Cake\Routing\Router;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Application setup class.
 *
 * This defines the bootstrapping logic and middleware layers you
 * want to use in your application.
 */
class Application extends BaseApplication implements AuthenticationServiceProviderInterface, AuthorizationServiceProviderInterface
{
    /**
     * Load all the application configuration and bootstrap logic.
     *
     * @return void
     */
    public function bootstrap(): void
    {
        // Call parent to load bootstrap from files.
        parent::bootstrap();

        if (PHP_SAPI === 'cli') {
            $this->bootstrapCli();
        } else {
            FactoryLocator::add(
                'Table',
                (new TableLocator())->allowFallbackClass(false)
            );
        }

        /*
         * Only try to load DebugKit in development mode
         * Debug Kit should not be installed on a production system
         */
        if (Configure::read('debug')) {
            $this->addPlugin('DebugKit');
            Configure::write('DebugKit.ignoreAuthorization', true);
            Configure::write('DebugKit.forceEnable', true);
        }

        // Load more plugins here
        $this->addPlugin('Muffin/Footprint');
        $this->addPlugin('Authentication');
        $this->addPlugin('Authorization');
        $this->addPlugin('Search');
        $this->addPlugin('Medii/Bake', ['isDefaultTheme' => true]);
        $this->addPlugin('Medii/Crud', []);
        $this->addPlugin('Medii/Approval', []);
        $this->addPlugin('Medii/File', []);
        $this->addPlugin('Medii/Block', []);
        $this->addPlugin('Medii/Metadata', []);
        $this->addPlugin('Medii/Vite', []);
        $this->addPlugin('Medii/TextSerialize', []);
        $this->addPlugin('Medii/StaticPages', []);
        $this->addPlugin('Medii/Recommend', []);
        $this->addPlugin('Medii/PostalCode', []);
        $this->addPlugin('MixerApi/CollectionView');
    }

    /**
     * Setup the middleware queue your application will use.
     *
     * @param \Cake\Http\MiddlewareQueue $middlewareQueue The middleware queue to setup.
     * @return \Cake\Http\MiddlewareQueue The updated middleware queue.
     */
    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        $middlewareQueue
            // Catch any exceptions in the lower layers,
            // and make an error page/response
            ->add(new ErrorHandlerMiddleware(Configure::read('Error')))

            // Handle plugin/theme assets like CakePHP normally does.
            ->add(new AssetMiddleware([
                'cacheTime' => Configure::read('Asset.cacheTime'),
            ]))

            // Add routing middleware.
            // If you have a large number of routes connected, turning on routes
            // caching in production could improve performance. For that when
            // creating the middleware instance specify the cache config name by
            // using it's second constructor argument:
            // `new RoutingMiddleware($this, '_cake_routes_')`
            ->add(new RoutingMiddleware($this))

            // Parse various types of encoded request bodies so that they are
            // available as array through $request->getData()
            // https://book.cakephp.org/4/en/controllers/middleware.html#body-parser-middleware
            ->add((new BodyParserMiddleware()))

            ->add(new AuthenticationMiddleware($this))
            ->add(new AuthorizationMiddleware($this))
            ->add(new RequestAuthorizationMiddleware())
            ->add('Muffin/Footprint.Footprint')

            // Cross Site Request Forgery (CSRF) Protection Middleware
            // https://book.cakephp.org/4/en/security/csrf.html#cross-site-request-forgery-csrf-middleware
            ->add(new CsrfProtectionMiddleware([
                'httponly' => true,
                'secure' => true,
            ]));

        return $middlewareQueue;
    }

    /**
     * Register application container services.
     *
     * @param \Cake\Core\ContainerInterface $container The Container to update.
     * @return void
     * @link https://book.cakephp.org/4/en/development/dependency-injection.html#dependency-injection
     */
    public function services(ContainerInterface $container): void
    {
        //
    }

    /**
     * Bootstrapping for CLI application.
     *
     * That is when running commands.
     *
     * @return void
     */
    protected function bootstrapCli(): void
    {
        $this->addOptionalPlugin('Cake/Repl');
        $this->addOptionalPlugin('Bake');

        $this->addPlugin('Migrations');

        // Load more plugins here
    }

    /**
     * サービスプロバイダのインスタンスを返します。
     *
     * @param \Psr\Http\Message\ServerRequestInterface $request Request
     * @return \Authentication\AuthenticationServiceInterface
     */
    public function getAuthenticationService(ServerRequestInterface $request): AuthenticationServiceInterface
    {
        $service = new AuthenticationService();

        $params = $request->getAttribute('params');

        if (
            (isset($params['prefix']) && ($params['prefix'] === 'Adsys' || $params['prefix'] === 'Adsys/Api')) ||
            (empty($params['prefix']) && $params['action'] === 'file')
        ) {
            // 認証されていない場合にユーザーがどこにリダイレクトするかを定義します。
            $service->setConfig([
                'unauthenticatedRedirect' => Router::url(['controller' => 'Admins', 'action' => 'login', 'prefix' => 'Adsys', 'plugin' => null]),
                'queryParam' => 'redirect',
            ]);

            $fields = [
                IdentifierInterface::CREDENTIAL_USERNAME => 'username',
                IdentifierInterface::CREDENTIAL_PASSWORD => 'password'
            ];

            // 認証者を読み込みます。セッションを優先してください。
            $service->loadAuthenticator('Authentication.Session', [
                'sessionKey' => 'Adsys',
                'identify' => true,
            ]);
            $service->loadAuthenticator('Authentication.Form', [
                'fields' => $fields,
                'loginUrl' => Router::url(['controller' => 'Admins', 'action' => 'login', 'prefix' => 'Adsys', 'plugin' => null]),
            ]);

            $resolver = [
                'className' => 'Authentication.Orm',
                'userModel' => 'Admins',
                'finder' => 'auth',
            ];

            // 識別子を読み込みます。
            $service->loadIdentifier('Authentication.Password', compact('fields', 'resolver'));

            return $service;
        } else if (
            (isset($params['prefix']) && ($params['prefix'] === 'AdsysMng' || $params['prefix'] === 'AdsysMng/Api')) ||
            (empty($params['prefix']) && $params['action'] === 'file')
        ) {
            // 認証されていない場合にユーザーがどこにリダイレクトするかを定義します。
            $service->setConfig([
                'unauthenticatedRedirect' => Router::url(['controller' => 'Admins', 'action' => 'login', 'prefix' => 'AdsysMng', 'plugin' => null]),
                'queryParam' => 'redirect',
            ]);

            $fields = [
                IdentifierInterface::CREDENTIAL_USERNAME => 'username',
                IdentifierInterface::CREDENTIAL_PASSWORD => 'password'
            ];

            // 認証者を読み込みます。セッションを優先してください。
            $service->loadAuthenticator('Authentication.Session', [
                'sessionKey' => 'AdsysMng',
                'identify' => true,
            ]);
            $service->loadAuthenticator('Authentication.Form', [
                'fields' => $fields,
                'loginUrl' => Router::url(['controller' => 'Admins', 'action' => 'login', 'prefix' => 'AdsysMng', 'plugin' => null]),
            ]);

            $resolver = [
                'className' => 'Authentication.Orm',
                'userModel' => 'Admins',
                'finder' => 'authMng',
            ];

            // 識別子を読み込みます。
            $service->loadIdentifier('Authentication.Password', compact('fields', 'resolver'));

            return $service;
        } else {
            $service->loadAuthenticator('Authentication.Session', [
                'sessionKey' => 'Adsys',
                'identify' => true,
            ]);
        }

        return $service;
    }

    public function getAuthorizationService(ServerRequestInterface $request): AuthorizationServiceInterface
    {
        $mapResolver = new MapResolver();

        $mapResolver->map(ServerRequest::class, RequestPolicy::class);

        $ormResolver = new OrmResolver();

        $resolver = new ResolverCollection([$mapResolver, $ormResolver]);

        return new AuthorizationService($resolver);
    }
}
