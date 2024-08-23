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
 * DeadLink mailer.
 */
class DeadLinkMailer extends Mailer
{
    /**
     * Mailer's name.
     *
     * @var string
     */
    public static $name = 'DeadLink';


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
    public function notification($admin, $data)
    {
        $this->viewBuilder()
            ->setTemplate('dead_link_notification');

        $now = new Chronos();
        $title = $now->format('Y年m月d日') . "【リンク切れチェック】" . Configure::read('Site.Meta.title');

        $this->setProfile('default')
            ->setFrom(Configure::read('Site.Settings.Mail.Admin.fromAddress'), Configure::read('Site.Settings.Mail.Admin.fromName'))
            ->setSender(Configure::read('Site.Settings.Mail.Admin.fromAddress'), Configure::read('Site.Settings.Mail.Admin.fromName'))
            ->setTo($admin->email)
            ->setSubject($title)
            ->setViewVars(['data' => $data, 'admin' => $admin]);
    }
}
