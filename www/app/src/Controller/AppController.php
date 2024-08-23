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
 * @since     0.2.9
 * @license   https://opensource.org/licenses/mit-license.php MIT License
 */

namespace App\Controller;

use App\Model\Filter\AccountsCollection;
use App\Model\Filter\FacilitiesCollection;
use Cake\Controller\Controller;
use Cake\Core\Configure;
use Cake\Event\EventInterface;
use Cake\Http\Exception\ForbiddenException;
use Cake\I18n\I18n;
use Cake\Log\Log;
use Cake\Routing\Router;
use Cake\Utility\Hash;
use Cake\Utility\Inflector;

/**
 * Application Controller
 *
 * Add your application-wide methods in the class below, your controllers
 * will inherit them.
 *
 * @link https://book.cakephp.org/4/en/controllers.html#the-app-controller
 */
class AppController extends Controller
{
    /**
     * Initialization hook method.
     *
     * Use this method to add common initialization code like loading components.
     *
     * e.g. `$this->loadComponent('FormProtection');`
     *
     * @return void
     */
    public function initialize(): void
    {
        parent::initialize();

        $this->loadComponent('RequestHandler');
        $this->loadComponent('Flash');

        /*
         * Enable the following component for recommended CakePHP form protection settings.
         * see https://book.cakephp.org/4/en/controllers/components/form-protection.html
         */
        //$this->loadComponent('FormProtection');

        // i18n::setLocale('en');

        // Log::error(print_r($this->request, true));

        // 言語設定後読み込みのためbootstrapに記載しない
        if (file_exists(CONFIG . 'site.php')) {
            Configure::load('site', 'default');
        }
        if (file_exists(CONFIG . 'site_local.php')) {
            Configure::load('site_local', 'default');
        }

        if (file_exists(CONFIG . 'master.php')) {
            Configure::load('master', 'default');
        }

        if ($this->request->getParam('prefix') === 'Adsys' || $this->request->getParam('prefix') === 'Adsys/Api') {

            // if (file_exists(CONFIG . 'auth.php')) {
            //     Configure::load('auth', 'default', false);
            // }
            $this->loadComponent('Authentication.Authentication', [
                'logoutRedirect' => [
                    'controller' => 'Pages',
                    'action' => 'index',
                    'prefix' => 'Adsys',
                ]
            ]);
            $this->loadComponent('Authorization.Authorization');
            if ($this->request->getParam('prefix') === 'Adsys/Api') {
                // $this->viewBuilder()->setClassName('MixerApi/CollectionView.JsonCollection');
                // $this->viewBuilder()->setClassName('MixerApi/HalView.HalJson');
                $this->Authorization->authorizeModel('index', 'view', 'edit', 'add', 'status', 'preview', 'confirm');
                $this->loadComponent('AdminUtility');
            }
        } else if ($this->request->getParam('prefix') === 'AdsysMng' || $this->request->getParam('prefix') === 'AdsysMng/Api') {

            Configure::write('ViteSetting.adapterArguments', ROOT . DS . 'assets' . DS . 'dist-mng');

            $this->loadComponent('Authentication.Authentication', [
                'logoutRedirect' => [
                    'controller' => 'Pages',
                    'action' => 'index',
                    'prefix' => 'AdsysMng',
                ]
            ]);
            $this->loadComponent('Authorization.Authorization');
            if ($this->request->getParam('prefix') === 'AdsysMng/Api') {
                // $this->viewBuilder()->setClassName('MixerApi/CollectionView.JsonCollection');
                // $this->viewBuilder()->setClassName('MixerApi/HalView.HalJson');
                $this->Authorization->authorizeModel('index', 'view', 'edit', 'add', 'status', 'preview', 'confirm');
                // $this->loadComponent('AdminUtility');
            }
        } else if (empty($this->request->getParam('prefix')) && $this->request->getParam('action') === 'file') {

            // $this->loadComponent('Authentication.Authentication');
        } else {
            $this->loadComponent('Authentication.Authentication', [
                'requireIdentity' => false,
            ]);
            if ($this->request->getParam('locale') && Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
                // 初期化
                I18n::setLocale(I18n::getDefaultLocale());
                $locale = $this->request->getParam('locale');
                $locales = Hash::extract(Configure::read('CustomSettings.Option.locale'), '{n}.locale');
                if (in_array($locale, $locales, true) && I18n::getDefaultLocale() !== $locale) {
                    I18n::setLocale($locale);
                }
            }
        }
    }

    public function beforeFilter(EventInterface $event)
    {
        parent::beforeFilter($event);

        if ($this->request->getParam('prefix') === 'Adsys' || $this->request->getParam('prefix') === 'AdsysMng') {
            $this->viewBuilder()->setLayout('adsys');
        } else {
        }
    }

    /**
     * _authResponseData method
     *
     * @return void
     */
    protected function _authResponseData()
    {

        $title = $this->Authentication->getIdentityData('title');
        $role = $this->Authentication->getIdentityData('role');

        $roleData = Configure::read("Roles." . $role) ?? [];

        if (!$roleData) {
            throw new ForbiddenException();
        }

        $requireRoutesKey = $roleData['requireRoutesKey'] ?? [];

        $menuList = Configure::read('Site.Settings.MenuList');

        $routes = [];

        foreach ($menuList as $menuHeaderKey => $contents) {
            $links = [];
            foreach ($contents as $contentKey) {
                $urlContentUrlKey = Inflector::dasherize($contentKey);
                if (in_array($urlContentUrlKey, $requireRoutesKey, true)) {
                    $links[] = [
                        'name' => Configure::read('Site.Settings.ContentsList.' . $contentKey),
                        'to' => './' . $urlContentUrlKey,
                        'key' => $contentKey,
                    ];
                }
            }
            if ($links) {
                $routes[] = [
                    'title' => Configure::read('Site.Settings.MenuHeader.' . $menuHeaderKey),
                    'links' => $links,
                ];
            }
        }

        $statusOptions = [];
        if ($roleData['statusOptions']) {
            foreach ($roleData['statusOptions'] as $key => $statsuKey) {
                $statusOptions[$key] = Configure::read('Approvals.allStatusOption.' . $statsuKey);
            }
        }

        $meta = [
            'redirectUri' => $this->Authentication->getLoginRedirect() ? Router::url($this->Authentication->getLoginRedirect()) : Router::url(['controller' => 'Pages', 'action' => 'index']),
            'routes' => $routes,
            'role' => $role,
            'statusOptions' => $statusOptions,
        ];

        $data = [
            'title' => $title,
            'meta' => $meta,
        ];

        return $data;
    }
}
