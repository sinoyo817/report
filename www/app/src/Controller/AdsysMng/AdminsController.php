<?php

declare(strict_types=1);

namespace App\Controller\AdsysMng;

use App\Controller\AppController;
use Cake\Core\Configure;
use Cake\Event\EventInterface;
use Cake\Http\Exception\BadRequestException;
use Cake\Http\Exception\ForbiddenException;
use Cake\Http\Exception\UnauthorizedException;
use Cake\Log\Log;
use Cake\Routing\Router;

/**
 * Admins Controller
 *
 * @method \App\Model\Entity\Admin[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class AdminsController extends AppController
{

    public function beforeFilter(EventInterface $event)
    {
        parent::beforeFilter($event);

        $this->Authentication->allowUnauthenticated(['login', 'me']);
    }

    /**
     * login method
     *
     * @return \Cake\Http\Response|void
     */
    public function login()
    {

        $result = $this->Authentication->getResult();
        // ユーザーがログインしている場合は、そのユーザーを送り出してください。

        if ($this->request->is('post') && $this->request->is('ajax')) {
            // $this->response = $this->response->withHeader('Content-Type','application/vnd.api+json');
            if ($result && $result->isValid()) {

                $data = $this->_authResponseData();
            } else {
                $statusCode = 422;
                $this->response = $this->response->withStatus($statusCode);
                $data = [
                    'title' => __('ユーザ名とパスワードが無効です'),
                    'status' => $statusCode,
                ];
            }
            $this->set('data', $data);
            $this->viewBuilder()->setOption('serialize', 'data');
        }
        if ($this->request->is('get') && $this->request->is('ajax')) {
            throw new UnauthorizedException();
        }
        if ($this->request->is('get') && $result && $result->isValid()) {

            $target = $this->Authentication->getLoginRedirect() ?? Router::url(['controller' => 'Pages', 'action' => 'index']);
            return $this->redirect($target);
        }
    }

    /**
     * logout method
     *
     * @return \Cake\Http\Response
     */
    public function logout()
    {

        $target = $this->Authentication->logout() ?? ['action' => 'login'];
        return $this->redirect($target);
    }

    /**
     * me method
     *
     * @return \Cake\Http\Response
     * @throws BadRequestException|UnauthorizedException
     */
    public function me()
    {

        if (!$this->request->is('ajax')) {
            throw new BadRequestException();
        }
        $result = $this->Authentication->getResult();

        if ($result && $result->isValid()) {
            $data = $this->_authResponseData();
        } else {
            $statusCode = 404;
            $this->response = $this->response->withStatus($statusCode);
            $data = [
                'title' => __('Unauthorized'),
                'status' => $statusCode,
            ];
        }
        $this->set('data', $data);
        $this->viewBuilder()->setOption('serialize', 'data');
    }

    /**
     * _authResponseData method
     *
     * @return void
     */
    protected function _authResponseData()
    {

        $title = $this->Authentication->getIdentityData('title');

        $routes = [
            [
                'title' => '設定管理',
                'links' => [
                    [
                        'name' => __('お知らせ'),
                        'to' => './settings/topics',
                        'key' => 'settings-topics',
                    ],
                    // [
                    //     'name' => __('観光地・イベント'),
                    //     'to' => './settings/events',
                    //     'key' => 'settings-events',
                    // ],
                    // [
                    //     'name' => __('フリーページ'),
                    //     'to' => './settings/freepages',
                    //     'key' => 'settings-freepages',
                    // ],
                    // [
                    //     'name' => __('お問い合わせ'),
                    //     'to' => './settings/contacts',
                    //     'key' => 'settings-contacts',
                    // ],
                    [
                        'name' => __('全般'),
                        'to' => './settings/general',
                        'key' => 'settings-general',
                    ],
                    [
                        'name' => __('オプション設定'),
                        'to' => './settings/option',
                        'key' => 'settings-option',
                    ],
                ],
            ],
            [
                'title' => '権限管理',
                'links' => [
                    [
                        'name' => __('アクセス管理'),
                        'to' => './approvals/access',
                        'key' => 'approvals-access',
                    ],
                ],
            ],
            [
                'title' => 'ファイル系管理',
                'links' => [
                    [
                        'name' => __('アセット'),
                        'to' => './assets',
                        'key' => 'assets',
                    ],
                    [
                        'name' => __('ファイル'),
                        'to' => './files',
                        'key' => 'files',
                    ],
                ],
            ],
            [
                'title' => 'マスタ管理',
                'links' => [
                    [
                        'name' => __('予算コード'),
                        'to' => './master-product-codes',
                        'key' => 'master-product-codes',
                    ],
                    [
                        'name' => __('作業内容'),
                        'to' => './master-work-codes',
                        'key' => 'master-work-codes',
                    ],
                    [
                        'name' => __('対応したいことリスト'),
                        'to' => './to-dos',
                        'key' => 'to-dos',
                    ],
                    // [
                    //     'name' => __('お知らせカテゴリ'),
                    //     'to' => './master-topic-categories',
                    //     'key' => 'master-topic-categories',
                    // ],
                    // [
                    //     'name' => __('エリア'),
                    //     'to' => './master-areas',
                    //     'key' => 'master-areas',
                    // ],
                    // [
                    //     'name' => __('観光地・イベントカテゴリ'),
                    //     'to' => './master-event-categories',
                    //     'key' => 'master-event-categories',
                    // ],
                    // [
                    //     'name' => __('お問い合わせカテゴリ'),
                    //     'to' => './master-contact-categories',
                    //     'key' => 'master-contact-categories',
                    // ],
                ],
            ],
            [
                'title' => 'アカウント管理',
                'links' => [
                    [
                        'name' => __('管理者'),
                        'to' => './admins',
                        'key' => 'admins',
                    ],
                    [
                        'name' => __('グループ管理'),
                        'to' => './master-groups',
                        'key' => 'master-groups',
                    ],
                ],
            ],
            [
                'title' => 'その他',
                'links' => [
                    [
                        'name' => __('データリセット'),
                        'to' => './resets',
                        'key' => 'resets',
                    ],
                ],
            ]
        ];

        $defaultStatusOptions = [
            [
                'title' => __d("admin", "公開"),
                'status' => Configure::read('Approvals.allStatusKey.publishedKey'),
                'sequence' => 1,
                'forSelect' => true,
                'forSearch' => true,
                'colorScheme' => 'green',
            ],
            [
                'title' => __d("admin", "非公開"),
                'status' => Configure::read('Approvals.allStatusKey.unpublishedKey'),
                'sequence' => 2,
                'forSelect' => true,
                'forSearch' => true,
                'colorScheme' => 'gray',
            ],
            [
                'title' => __d("admin", "コピー"),
                'status' => Configure::read('Approvals.allStatusKey.copiedKey'),
                'sequence' => 10,
                'forSelect' => true,
                'forSearch' => false,
            ],
            [
                'title' => __d("admin", "削除"),
                'status' => Configure::read('Approvals.allStatusKey.deletedKey'),
                'sequence' => 20,
                'forSelect' => true,
                'forSearch' => false,
            ],
            [
                'title' => __d("admin", "編集中"),
                'status' => Configure::read('Approvals.allStatusKey.draftKey'),
                'sequence' => 99,
                'forSelect' => false,
                'forSearch' => false,
                'colorScheme' => 'yellow',
            ],
        ];

        $enableStatusOptions = [
            [
                'title' => __d("admin", "有効"),
                'status' => Configure::read('Approvals.allStatusKey.publishedKey'),
                'sequence' => 1,
                'forSelect' => true,
                'forSearch' => true,
                'colorScheme' => 'green',
            ],
            [
                'title' => __d("admin", "無効"),
                'status' => Configure::read('Approvals.allStatusKey.unpublishedKey'),
                'sequence' => 2,
                'forSelect' => true,
                'forSearch' => true,
                'colorScheme' => 'gray',
            ],
            [
                'title' => __d("admin", "削除"),
                'status' => Configure::read('Approvals.allStatusKey.deletedKey'),
                'sequence' => 20,
                'forSelect' => true,
                'forSearch' => false,
            ],
            [
                'title' => __d("admin", "編集中"),
                'status' => Configure::read('Approvals.allStatusKey.draftKey'),
                'sequence' => 99,
                'forSelect' => false,
                'forSearch' => false,
                'colorScheme' => 'yellow',
            ],
        ];

        $fileStatusOptions = [
            [
                'title' => __d("admin", "公開"),
                'status' => Configure::read('Approvals.allStatusKey.publishedKey'),
                'sequence' => 1,
                'forSelect' => false,
                'forSearch' => true,
                'colorScheme' => 'green',
            ],
            [
                'title' => __d("admin", "非公開"),
                'status' => Configure::read('Approvals.allStatusKey.unpublishedKey'),
                'sequence' => 2,
                'forSelect' => false,
                'forSearch' => true,
                'colorScheme' => 'gray',
            ],
            [
                'title' => __d("admin", "削除"),
                'status' => Configure::read('Approvals.allStatusKey.deletedKey'),
                'sequence' => 20,
                'forSelect' => true,
                'forSearch' => false,
            ],
        ];

        $assetStatusOptions = [
            [
                'title' => __d("admin", "公開"),
                'status' => Configure::read('Approvals.allStatusKey.publishedKey'),
                'sequence' => 1,
                'forSelect' => true,
                'forSearch' => true,
                'colorScheme' => 'green',
            ],
            [
                'title' => __d("admin", "非公開"),
                'status' => Configure::read('Approvals.allStatusKey.unpublishedKey'),
                'sequence' => 2,
                'forSelect' => true,
                'forSearch' => true,
                'colorScheme' => 'gray',
            ],
            [
                'title' => __d("admin", "削除"),
                'status' => Configure::read('Approvals.allStatusKey.deletedKey'),
                'sequence' => 20,
                'forSelect' => true,
                'forSearch' => false,
            ],
        ];
        $toDosStatusOptions = [
            [
                'title' => __d("admin", "未処理"),
                'status' => Configure::read('Approvals.allStatusKey.draftKey'),
                'sequence' => 5,
                'forSelect' => true,
                'forSearch' => true,
                'colorScheme' => 'purple',
            ],
            [
                'title' => __d("admin", "対応中"),
                'status' => Configure::read('Approvals.allStatusKey.publishedKey'),
                'sequence' => 1,
                'forSelect' => true,
                'forSearch' => true,
                'colorScheme' => 'green',
            ],
            [
                'title' => __d("admin", "対応完了"),
                'status' => Configure::read('Approvals.allStatusKey.unpublishedKey'),
                'sequence' => 2,
                'forSelect' => true,
                'forSearch' => true,
            ],
            [
                'title' => __d("admin", "コピー"),
                'status' => Configure::read('Approvals.allStatusKey.copiedKey'),
                'sequence' => 10,
                'forSelect' => true,
                'forSearch' => false,
            ],
            [
                'title' => __d("admin", "削除"),
                'status' => Configure::read('Approvals.allStatusKey.deletedKey'),
                'sequence' => 20,
                'forSelect' => true,
                'forSearch' => false,
            ],
        ];

        $meta = [
            'redirectUri' => $this->Authentication->getLoginRedirect() ? Router::url($this->Authentication->getLoginRedirect()) : Router::url(['controller' => 'Pages', 'action' => 'index']),
            'routes' => $routes,
            'statusOptions' => [
                'default' => $defaultStatusOptions,
                'admins' => $enableStatusOptions,
                'files' => $fileStatusOptions,
                'assets' => $assetStatusOptions,
                'to-dos' => $toDosStatusOptions,
            ],
        ];

        $data = [
            'title' => $title,
            'meta' => $meta,
        ];

        return $data;
    }
}
