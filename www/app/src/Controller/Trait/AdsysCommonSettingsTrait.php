<?php

declare(strict_types=1);

namespace App\Controller\Trait;

use Cake\Core\Configure;

/**
 *
 */
trait AdsysCommonSettingsTrait
{
    /**
     * Index method
     *
     * @return \Cake\Http\Response|null|void
     * @throws \Cake\Http\Exception\MethodNotAllowedException
     */
    public function localeSettings()
    {
        $locales = Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey') ? Configure::read('CustomSettings.Option.locale') : [];
        $data = [
            'locales' => $locales,
        ];
        $this->set('data', $data);
        $this->viewBuilder()->setOption('serialize', 'data');
    }
}
