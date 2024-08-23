<?php

declare(strict_types=1);

namespace App\Controller\AdsysMng\Api;

use App\Controller\AppController;
use App\Controller\Trait\AdsysCommonSettingsTrait;

/**
 * CommonSettings Controller
 *
 * @method \App\Model\Entity\CommonSetting[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class CommonSettingsController extends AppController
{
    use AdsysCommonSettingsTrait;

    public function initialize(): void
    {
        $this->loadComponent('AdminUtility', ['ignoreTable' => true]);
        parent::initialize();
    }
}
