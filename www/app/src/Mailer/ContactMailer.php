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
 * Contact mailer.
 */
class ContactMailer extends Mailer
{
    /**
     * Mailer's name.
     *
     * @var string
     */
    public static $name = 'Contact';


    /**
     * published function
     *
     * @param \Cake\Datasource\EntityInterface $data
     *
     * @return void
     */
    public function complete($data, $MasterPrefectures)
    {
        $this->viewBuilder()
            ->setTemplate('complete');

        $this->setProfile('default')
            ->setFrom(Configure::read('CustomSettings.General.fromMail'), Configure::read('CustomSettings.General.site'))
            ->setSender(Configure::read('CustomSettings.General.fromMail'), Configure::read('CustomSettings.General.site'))
            ->setTo($data->email)
            ->setSubject("【" . Configure::read('CustomSettings.General.site') . "】お問い合わせありがとうございます")
            ->setViewVars(['data' => $data, 'MasterPrefectures' => $MasterPrefectures]);
    }

    /**
     * unpublished function
     *
     * @param \Cake\Datasource\EntityInterface $data
     *
     * @return void
     */
    public function completeForAdmin($data, $MasterPrefectures)
    {
        $this->viewBuilder()
            ->setTemplate('complete_for_admin');

        $this->setProfile('default')
            ->setFrom(Configure::read('CustomSettings.General.fromMail'), Configure::read('CustomSettings.General.site'))
            ->setSender(Configure::read('CustomSettings.General.fromMail'), Configure::read('CustomSettings.General.site'))
            ->setTo(Configure::read('CustomSettings.General.toMail'))
            ->setSubject("【" . Configure::read('CustomSettings.General.site') . "】にお問い合わせがありました")
            ->setViewVars(['data' => $data, 'MasterPrefectures' => $MasterPrefectures])
			->setAttachments([
                basename($data->file->filename) => [
                    'file' => ROOT. $data->file->filePath,
                    'mimetype' => $data->file->mime,
                    'contentId' => \Cake\Utility\Text::uuid()
                ],
			])
            ;
    }
}
