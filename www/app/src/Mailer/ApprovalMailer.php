<?php

declare(strict_types=1);

namespace App\Mailer;

use ArrayObject;
use Cake\Chronos\Chronos;
use Cake\Core\Configure;
use Cake\Datasource\EntityInterface;
use Cake\Event\EventInterface;
use Cake\Log\Log;
use Cake\Mailer\Mailer;

/**
 * Approval mailer.
 */
class ApprovalMailer extends Mailer
{
    /**
     * Mailer's name.
     *
     * @var string
     */
    public static $name = 'Approval';


    /**
     * published function
     *
     * @param \App\Model\Entity\Admin $toUser
     * @param \Cake\Datasource\EntityInterface $entity
     * @param array $url
     * @param string $content
     *
     * @return void
     */
    public function published_user($toUser, $entity, $url, $content)
    {
        $this->viewBuilder()
            ->setTemplate('approved_user');

        $approvalTitle = "公開";
        $title = "【" . Configure::read('CustomSettings.General.site') . "】{$approvalTitle}が行われました";

        $this->setProfile('default')
            ->setFrom(Configure::read('CustomSettings.General.fromMail'), Configure::read('CustomSettings.General.site'))
            ->setSender(Configure::read('CustomSettings.General.fromMail'), Configure::read('CustomSettings.General.site'))
            ->setTo($toUser->email)
            ->setSubject($title)
            ->setViewVars(['data' => $entity, 'url' => $url, 'user' => $toUser, 'content' => $content, 'approvalTitle' => $approvalTitle]);
    }

    /**
     * unpublished function
     *
     * @param \App\Model\Entity\Admin $toUser
     * @param \Cake\Datasource\EntityInterface $entity
     * @param array $url
     * @param string $content
     *
     * @return void
     */
    public function unpublished_user($toUser, $entity, $url, $content)
    {
        $this->viewBuilder()
            ->setTemplate('approved_user');

        $approvalTitle = "非公開";
        $title = "【" . Configure::read('CustomSettings.General.site') . "】{$approvalTitle}が行われました";

        $this->setProfile('default')
            ->setFrom(Configure::read('CustomSettings.General.fromMail'), Configure::read('CustomSettings.General.site'))
            ->setSender(Configure::read('CustomSettings.General.fromMail'), Configure::read('CustomSettings.General.site'))
            ->setTo($toUser->email)
            ->setSubject($title)
            ->setViewVars(['data' => $entity, 'url' => $url, 'user' => $toUser, 'approvalTitle' => $approvalTitle]);
    }

    /**
     * remand function
     *
     * @param \App\Model\Entity\Admin $toUser
     * @param \Cake\Datasource\EntityInterface $entity
     * @param array $url
     * @param string $summary
     *
     * @return void
     */
    public function remand_user($toUser, $entity, $url, $summary, $content)
    {
        $this->viewBuilder()
            ->setTemplate('approved_user');

        $approvalTitle = "差戻し";
        $title = "【" . Configure::read('CustomSettings.General.site') . "】{$approvalTitle}が行われました";

        $this->setProfile('default')
            ->setFrom(Configure::read('CustomSettings.General.fromMail'), Configure::read('CustomSettings.General.site'))
            ->setSender(Configure::read('CustomSettings.General.fromMail'), Configure::read('CustomSettings.General.site'))
            ->setTo($toUser->email)
            ->setSubject($title)
            ->setViewVars(['data' => $entity, 'url' => $url, 'user' => $toUser, 'content' => $content, 'summary' => $summary, 'approvalTitle' => $approvalTitle]);
    }

    /**
     * publishedReq function
     *
     * @param \App\Model\Entity\Admin $toUser
     * @param \Cake\Datasource\EntityInterface $entity
     * @param array $url
     * @param string $summary
     *
     * @return void
     */
    public function published_req_admin($toUser, $entity, $url, $content, $user)
    {
        $this->viewBuilder()
            ->setTemplate('approval_admin');

        $now = new Chronos();
        $approvalTitle = "公開申請";
        $title = $now->format('Y年m月d日') . "【{$approvalTitle}】" . Configure::read('CustomSettings.General.site');

        $this->setProfile('default')
            ->setFrom(Configure::read('CustomSettings.General.fromMail'), Configure::read('CustomSettings.General.site'))
            ->setSender(Configure::read('CustomSettings.General.fromMail'), Configure::read('CustomSettings.General.site'))
            ->setTo($toUser->email)
            ->setSubject($title)
            ->setViewVars(['data' => $entity, 'url' => $url, 'admin' => $toUser, 'content' => $content, 'user' => $user, 'approvalTitle' => $approvalTitle]);
    }

    /**
     * publishedReq function
     *
     * @param \App\Model\Entity\Admin $toUser
     * @param \Cake\Datasource\EntityInterface $entity
     * @param array $url
     * @param string $summary
     *
     * @return void
     */
    public function published_req_user($toUser, $entity, $url, $content)
    {
        $this->viewBuilder()
            ->setTemplate('approval_user');

        $approvalTitle = "公開申請";
        $title = "【" . Configure::read('CustomSettings.General.site') . "】{$approvalTitle}を行いました";

        $this->setProfile('default')
            ->setFrom(Configure::read('CustomSettings.General.fromMail'), Configure::read('CustomSettings.General.site'))
            ->setSender(Configure::read('CustomSettings.General.fromMail'), Configure::read('CustomSettings.General.site'))
            ->setTo($toUser->email)
            ->setSubject($title)
            ->setViewVars(['data' => $entity, 'url' => $url, 'user' => $toUser, 'content' => $content, 'approvalTitle' => $approvalTitle]);
    }

    /**
     * unpublishedReq function
     *
     * @param \App\Model\Entity\Admin $toUser
     * @param \Cake\Datasource\EntityInterface $entity
     * @param array $url
     * @param string $summary
     *
     * @return void
     */
    public function unpublished_req_admin($toUser, $entity, $url, $content, $user)
    {
        $this->viewBuilder()
            ->setTemplate('approval_admin');

        $now = new Chronos();
        $approvalTitle = "非公開申請";
        $title = $now->format('Y年m月d日') . "【{$approvalTitle}】" . Configure::read('CustomSettings.General.site');


        $this->setProfile('default')
            ->setFrom(Configure::read('CustomSettings.General.fromMail'), Configure::read('CustomSettings.General.site'))
            ->setSender(Configure::read('CustomSettings.General.fromMail'), Configure::read('CustomSettings.General.site'))
            ->setTo($toUser->email)
            ->setSubject($title)
            ->setViewVars(['data' => $entity, 'url' => $url, 'admin' => $toUser, 'content' => $content, 'user' => $user, 'approvalTitle' => $approvalTitle]);
    }
    /**
     * unpublishedReq function
     *
     * @param \App\Model\Entity\Admin $toUser
     * @param \Cake\Datasource\EntityInterface $entity
     * @param array $url
     * @param string $summary
     *
     * @return void
     */
    public function unpublished_req_user($toUser, $entity, $url, $content)
    {
        $this->viewBuilder()
            ->setTemplate('approval_user');

        $approvalTitle = "非公開申請";
        $title = "【" . Configure::read('CustomSettings.General.site') . "】{$approvalTitle}を行いました";

        $this->setProfile('default')
            ->setFrom(Configure::read('CustomSettings.General.fromMail'), Configure::read('CustomSettings.General.site'))
            ->setSender(Configure::read('CustomSettings.General.fromMail'), Configure::read('CustomSettings.General.site'))
            ->setTo($toUser->email)
            ->setSubject($title)
            ->setViewVars(['data' => $entity, 'url' => $url, 'user' => $toUser, 'content' => $content, 'approvalTitle' => $approvalTitle]);
    }
}
