<?php

declare(strict_types=1);

namespace App\Controller\Component;

use ArrayObject;
use Cake\Controller\Component;
use Cake\Core\Configure;
use Cake\Datasource\EntityInterface;
use Cake\Event\EventInterface;
use Cake\I18n\I18n;
use Cake\Log\Log;
use Cake\Mailer\MailerAwareTrait;
use Cake\Routing\Router;
use Cake\Utility\Hash;
use Cake\Utility\Inflector;

/**
 * AdminUtility component
 */
class AdminUtilityComponent extends Component
{
    use MailerAwareTrait;
    /**
     * Default configuration.
     *
     * @var array<string, mixed>
     */
    protected $_defaultConfig = [];

    public function initialize(array $config): void
    {
        parent::initialize($config);
        $controller = $this->getController();

        if (isset($config['ignoreTable']) && $config['ignoreTable']) {
            $this->setConfig('ignoreTable', $config['ignoreTable']);
        }

        if (!$this->getConfig('ignoreTable')) {
            $table = $controller->fetchTable();
            $isApprovalBehavior = $table->hasBehavior('Approval');

            if ($isApprovalBehavior) {
                $table->changePrivate();
            }
        }
    }

    /**
     * flattenCustom function
     *
     * 最大深さから$maxDimention分までHash:;flattenにする
     *
     * @param array $data
     * @param string $separator
     * @param int $maxDimention
     * @return void
     */
    public static function flattenCustom(array $data, int $maxDimention = 0, string $separator = '.')
    {
        $result = [];
        $stack = [];
        $path = '';

        reset($data);
        while (!empty($data)) {
            $key = key($data);
            $element = $data[$key];
            unset($data[$key]);

            $maxDimentions = is_array($element) ? Hash::maxDimensions($element) : 0;

            if (is_array($element) && !empty($element) && $maxDimentions > $maxDimention) {
                if (!empty($data)) {
                    $stack[] = [$data, $path];
                }
                $data = $element;
                reset($data);
                $path .= $key . $separator;
            } else {
                $result[$path . $key] = $element;
            }

            if (empty($data) && !empty($stack)) {
                [$data, $path] = array_pop($stack);
                reset($data);
            }
        }

        return $result;
    }

    public function approvalMail($send = false, $roles = [], $ignoreStatus = ['deleted', 'copied'], $content = "")
    {
        $controller = $this->getController();

        $baseUrl = Inflector::dasherize($controller->getName());

        $auth = $controller->getRequest()->getAttribute('identity');
        $requestStatus = $controller->getRequest()->getData('status');
        $adminsTable = $controller->fetchTable('Admins');
        $admins = $adminsTable->find()->all()->toArray();

        $request = $controller->getRequest()->getData();

        $table = $controller->fetchTable();
        $baseTableName = $table->getTable();
        $baseTableAlias = $table->getAlias();

        $remandsTable = $controller->fetchTable('ApprovalRemands');
        if (!in_array($requestStatus, $ignoreStatus)) {
            $table->getEventManager()->on('Model.afterSave', function (EventInterface $event, EntityInterface $entity, ArrayObject $options) use (
                $admins,
                $auth,
                $request,
                $remandsTable,
                $send,
                $baseTableName,
                $baseTableAlias,
                $baseUrl,
                $roles,
                $content,
            ) {
                $subject = $event->getSubject();
                $table = $subject->getTable();

                if ($table === $baseTableName) {
                    $oldStatus = $entity->getOriginal('status');
                    $status = $entity->status;

                    if ($oldStatus === $status) {
                        return true;
                    }
                    if ($auth->role === 'Admin' && $entity->created_by_admin === $auth->id && $entity->modified_by_admin === $auth->id && !$entity->modified_by_user) {
                        return true;
                    }

                    $url = [
                        'crud' => Configure::read('Site.Settings.baseAdminUrl') . $baseUrl . '/crud/' . $entity->id,
                        'preview' => Configure::read('Site.Settings.baseAdminUrl') . 'api/' . $baseUrl . '/preview/' . $entity->id
                    ];

                    // フリーページは例外
                    if ($entity->getSource() === "FreepageDirectories") {
                        $url['crud'] = Configure::read('Site.Settings.baseAdminUrl') . 'freepages' . ($entity->type === Configure::read('Site.Settings.FreepageTypeKey.directoryKey') ? "/dir-crud/" . $entity->id : '/crud/' . $entity->freepage_document_id);
                        $url['preview'] = $entity->type === Configure::read('Site.Settings.FreepageTypeKey.documentKey') ? Configure::read('Site.Settings.baseAdminUrl') . 'api/' . 'freepage-documents/preview/' . $entity->freepage_document_id : "";
                    }

                    if ($auth->role === 'Admin') {
                        $toUser = [];
                        if ($entity->created_by_admin !== $auth->id) {
                            $toUser = Hash::extract($admins, "{n}[id={$entity->created_by_admin}]");
                        } elseif ($entity->modified_by_user) {
                            $toUser = Hash::extract($admins, "{n}[id={$entity->modified_by_user}]");
                        }
                        if (isset($toUser[0])) {
                            if ($status === 'published') {

                                if ($send) {
                                    $this->getMailer('Approval')->send('published_user', [$toUser[0], $entity, $url, $content]);
                                }
                            }
                            if ($status === 'unpublished') {
                                if ($send) {
                                    $this->getMailer('Approval')->send('unpublished_user', [$toUser[0], $entity, $url, $content]);
                                }
                            }
                            if ($status === 'remand') {
                                $summary = $request['summary'] ?? "";
                                if ($send) {
                                    $this->getMailer('Approval')->send('remand_user', [$toUser[0], $entity, $url, $summary, $content]);
                                }
                                $remandsEntity = $remandsTable->newEmptyEntity();
                                $remandsEntity->foreign_id = $entity->id;
                                $remandsEntity->summary = $summary;
                                $remandsEntity->model = $baseTableAlias;
                                $remandsTable->save($remandsEntity);
                            }
                        }
                    }
                    if ($roles) {
                        foreach ($roles as $role) {
                            if ($auth->role === $role) {
                                $sendAdminId = Configure::read('Site.Settings.SendAdminId');
                                $toUser = Hash::extract($admins, "{n}[id={$sendAdminId}]");
                                if (isset($toUser[0])) {
                                    if ($status === 'published_req') {
                                        if ($send) {
                                            $this->getMailer('Approval')->send('published_req_admin', [$toUser[0], $entity, $url, $content, $auth]);
                                            $this->getMailer('Approval')->send('published_req_user', [$auth, $entity, $url, $content]);
                                        }
                                    }
                                    if ($status === 'unpublished_req') {
                                        if ($send) {
                                            $this->getMailer('Approval')->send('unpublished_req_admin', [$toUser[0], $entity, $url, $content, $auth]);
                                            $this->getMailer('Approval')->send('unpublished_req_user', [$auth, $entity, $url, $content]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
                $table->getEventManager()->on('Model.I18nUpdate', function (EventInterface $event, $data) use (
                    $admins,
                    $auth,
                    $request,
                    $remandsTable,
                    $send,
                    $baseTableName,
                    $baseTableAlias,
                    $baseUrl,
                    $roles,
                    $content,
                ) {
                    // $subject = $event->getSubject();
                    // $table = $subject->getTable();

                    $locale = I18n::getLocale();

                    if ($data && is_array($data)) {
                        foreach ($data as $entity) {
                            $oldStatus = $entity->status;
                            $status = $request['status'];

                            if ($oldStatus === $status) {
                                return true;
                            }
                            if ($auth->role === 'Admin' && $entity->created_by_admin === $auth->id && $entity->modified_by_admin === $auth->id && !$entity->modified_by_user) {
                                return true;
                            }

                            $url = [
                                'crud' => Configure::read('Site.Settings.baseAdminUrl') . $baseUrl . "/crud/{$locale}/" . $entity->id,
                                'preview' => Configure::read('Site.Settings.baseAdminUrl') . 'api/' . $baseUrl . '/preview/' . $entity->id . "?locale={$locale}",
                            ];

                            // フリーページは例外
                            if ($entity->getSource() === "FreepageDirectories") {
                                $url['crud'] = Configure::read('Site.Settings.baseAdminUrl') . 'freepages' . ($entity->type === Configure::read('Site.Settings.FreepageTypeKey.directoryKey') ? "/dir-crud/{$locale}/" . $entity->id : "/crud/{$locale}/" . $entity->freepage_document_id);
                                $url['preview'] = $entity->type === Configure::read('Site.Settings.FreepageTypeKey.documentKey') ? Configure::read('Site.Settings.baseAdminUrl') . 'api/' . 'freepage-documents/preview/' . $entity->freepage_document_id . "?locale={$locale}" : "";
                            }

                            if ($auth->role === 'Admin') {
                                $toUser = [];
                                if ($entity->created_by_admin !== $auth->id) {
                                    $toUser = Hash::extract($admins, "{n}[id={$entity->created_by_admin}]");
                                } elseif ($entity->modified_by_user) {
                                    $toUser = Hash::extract($admins, "{n}[id={$entity->modified_by_user}]");
                                }
                                if (isset($toUser[0])) {
                                    if ($status === 'published') {

                                        if ($send) {
                                            $this->getMailer('Approval')->send('published_user', [$toUser[0], $entity, $url, $content]);
                                        }
                                    }
                                    if ($status === 'unpublished') {
                                        if ($send) {
                                            $this->getMailer('Approval')->send('unpublished_user', [$toUser[0], $entity, $url, $content]);
                                        }
                                    }
                                    if ($status === 'remand') {
                                        $summary = $request['summary'] ?? "";
                                        if ($send) {
                                            $this->getMailer('Approval')->send('remand_user', [$toUser[0], $entity, $url, $summary, $content]);
                                        }
                                        $remandsEntity = $remandsTable->newEmptyEntity();
                                        $remandsEntity->foreign_id = $entity->id;
                                        $remandsEntity->summary = $summary;
                                        $remandsEntity->model = $baseTableAlias;
                                        $remandsTable->save($remandsEntity);
                                    }
                                }
                            }
                            if ($roles) {
                                foreach ($roles as $role) {
                                    if ($auth->role === $role) {
                                        $sendAdminId = Configure::read('Site.Settings.SendAdminId');
                                        $toUser = Hash::extract($admins, "{n}[id={$sendAdminId}]");
                                        if (isset($toUser[0])) {
                                            if ($status === 'published_req') {
                                                if ($send) {
                                                    $this->getMailer('Approval')->send('published_req_admin', [$toUser[0], $entity, $url, $content, $auth]);
                                                    $this->getMailer('Approval')->send('published_req_user', [$auth, $entity, $url, $content]);
                                                }
                                            }
                                            if ($status === 'unpublished_req') {
                                                if ($send) {
                                                    $this->getMailer('Approval')->send('unpublished_req_admin', [$toUser[0], $entity, $url, $content, $auth]);
                                                    $this->getMailer('Approval')->send('unpublished_req_user', [$auth, $entity, $url, $content]);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    }
}
