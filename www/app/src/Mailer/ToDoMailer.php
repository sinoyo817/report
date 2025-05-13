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
 * Report mailer.
 */
class ToDoMailer extends Mailer
{
    /**
     * Mailer's name.
     *
     * @var string
     */
    public static $name = 'ToDo';


    /**
     * published function
     *
     * @param \Cake\Datasource\EntityInterface $data
     *
     * @return void
     */
    public function sendToDo($data, $admin)
    {
        $toMail = Configure::read('CustomSettings.General.toMail');

        $this->viewBuilder()->setTemplate('todo');

        $this->setProfile('default')
            ->setFrom(Configure::read('CustomSettings.General.fromMail'), $data->create_admin->title)
            ->setSender(Configure::read('CustomSettings.General.fromMail'), $data->create_admin->title)
            ->setTo($toMail)
            ->setSubject("【日報管理システム】{$admin->title}さんより改修依頼が来ています）")
            ->setViewVars(['data' => $data, 'admin' => $admin]);
    }
}
