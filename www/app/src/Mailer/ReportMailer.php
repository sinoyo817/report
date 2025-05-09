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
class ReportMailer extends Mailer
{
    /**
     * Mailer's name.
     *
     * @var string
     */
    public static $name = 'Report';


    /**
     * published function
     *
     * @param \Cake\Datasource\EntityInterface $data
     *
     * @return void
     */
    public function sendReport($data, $ProductCodes, $mail)
    {
        $toMail = $mail ?? Configure::read('CustomSettings.General.toMail');

        $this->viewBuilder()->setTemplate('report');

        $this->setProfile('default')
            ->setFrom(Configure::read('CustomSettings.General.fromMail'), $data->create_admin->title)
            ->setSender(Configure::read('CustomSettings.General.fromMail'), $data->create_admin->title)
            ->setTo($toMail)
            ->setSubject("{$data->work_date->format('Y/m/d')} 日報（{$data->create_admin->title}）")
            ->setViewVars(['data' => $data, 'ProductCodes' => $ProductCodes]);
    }
}
