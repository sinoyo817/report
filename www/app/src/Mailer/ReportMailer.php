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
    public function sendReport($data, $ProductCodes)
    {
        $this->viewBuilder()->setTemplate('report');

        $this->setProfile('default')
            ->setFrom($data->create_admin->email, $data->create_admin->title)
            ->setSender($data->create_admin->email, $data->create_admin->title)
            ->setTo(Configure::read('CustomSettings.General.fromMail'))
            ->setSubject("{$data->work_date->format('Y/m/d')} 日報（{$data->create_admin->title}）")
            ->setViewVars(['data' => $data, 'ProductCodes' => $ProductCodes]);
    }
}
