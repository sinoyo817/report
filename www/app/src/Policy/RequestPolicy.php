<?php

declare(strict_types=1);

namespace App\Policy;

use App\Model\Entity\Admin;
use Authorization\Policy\RequestPolicyInterface;
use Cake\Core\Configure;
use Cake\Http\ServerRequest;
use Cake\Log\Log;
use Cake\Utility\Hash;
use Cake\Utility\Inflector;

class RequestPolicy implements RequestPolicyInterface
{
    // アクセス可能
    public $commonRequireRequest = [
        'Admins' => [
            'me', 'auth', 'authEdit', 'authPasswordEdit', 'authEditConfirm',
        ],
        'Files' => [
            'index', 'upload', 'view',
        ],
        'Accessibilities' => [
            'link', 'gif'
        ],
        'CommonSettings' => [
            'localeSettings'
        ],
    ];

    public $changeControllerName = [
        'FreepageDirectories' => 'Freepages',
        'FreepageDocuments' => 'Freepages',
    ];

    /**
     * Method to check if the request can be accessed
     *
     * @param \Authorization\IdentityInterface|null $identity Identity
     * @param \Cake\Http\ServerRequest $request Server Request
     * @return bool
     */
    public function canAccess($identity, ServerRequest $request)
    {
        $params = $request->getAttribute('params');

        if (empty($params['prefix'])) {
            return true;
        }

        if (isset($params['prefix'])) {

            // AppController非経由のため
            // if (file_exists(CONFIG . 'approval.php')) {
            //     Configure::load('approval', 'default', false);
            // }

            // if (file_exists(CONFIG . 'auth.php')) {
            //     Configure::load('auth', 'default', false);
            // }
            $controller = $request->getParam('controller');
            $action = $request->getParam('action');
            $prefix = $params['prefix'];

            if ($prefix === 'Adsys') {
                if (
                    $controller === 'Admins' ||
                    ($controller === 'Pages' && $action === 'index')
                ) {
                    return true;
                }
            }
            if ($prefix === 'AdsysMng') {
                if (
                    $controller === 'Admins' ||
                    ($controller === 'Pages' && $action === 'index')
                ) {
                    return true;
                }
            }
            // Log::error(print_r($controller, true));

            if ($params['prefix'] === 'AdsysMng/Api') {
                if ($identity) {
                    $userEntity = $identity->getOriginalData();
                    if ($userEntity instanceof Admin) {
                        $superuser = $userEntity->superuser;

                        if ($superuser) {
                            return true;
                        }
                    }
                }
            }
            if ($params['prefix'] === 'Adsys/Api') {
                if ($identity) {
                    $userEntity = $identity->getOriginalData();
                    if ($userEntity instanceof Admin) {
                        $role = $userEntity->role;

                        $superuser = $userEntity->superuser;

                        if ($superuser) {
                            return true;
                        }

                        $roleData = Configure::read("Roles." . $role) ?? [];
                        if (!$roleData) {
                            return false;
                        }

                        $controller = isset($this->changeControllerName[$controller]) ? $this->changeControllerName[$controller] : $controller;

                        if (isset($this->commonRequireRequest[$controller]) && in_array($action, $this->commonRequireRequest[$controller], true)) {
                            return true;
                        }

                        $controller = Inflector::dasherize($controller);

                        // ホワイトリスト方式 コントローラー単位
                        if (in_array($controller, $roleData['requireRoutesKey'], true)) {
                            return true;
                        }
                    }
                } else {
                    if ($action === 'preview') {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}
