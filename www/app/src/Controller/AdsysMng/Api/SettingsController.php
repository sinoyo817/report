<?php

declare(strict_types=1);

namespace App\Controller\AdsysMng\Api;

use App\Controller\AppController;
use Cake\Core\Configure;

/**
 * Settings Controller
 *
 * @method \App\Model\Entity\Setting[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class SettingsController extends AppController
{
    public function topicsView()
    {
        $this->_getSettingFileData('Topics');
    }

    public function topicsUpdate()
    {
        $this->_updateSettingFileData('Topics');
    }

    public function eventsView()
    {
        $this->_getSettingFileData('Events');
    }

    public function eventsUpdate()
    {
        $this->_updateSettingFileData('Events');
    }

    public function freepagesView()
    {
        $this->_getSettingFileData('Freepages');
    }

    public function freepagesUpdate()
    {
        $this->_updateSettingFileData('Freepages');
    }

    public function contactsView()
    {
        $this->_getSettingFileData('Contacts');
    }

    public function contactsUpdate()
    {
        $this->_updateSettingFileData('Contacts');
    }

    public function generalView()
    {
        $this->_getSettingFileData('General');
    }

    public function generalUpdate()
    {
        $this->_updateSettingFileData('General');
    }

    public function optionView()
    {
        $this->_getSettingFileData('Option');
    }

    public function optionUpdate()
    {
        $this->_updateSettingFileData('Option');
    }


    protected function _getSettingFileData($key)
    {

        try {
            $data = Configure::readOrFail("CustomSettings.{$key}");
        } catch (\RuntimeException $e) {
        }

        $this->set('data', $data);
        $this->viewBuilder()->setOption('serialize', 'data');
    }

    protected function _updateSettingFileData($key)
    {

        $json = [];
        if (file_exists(CONFIG . 'settings.json')) {
            $d = file_get_contents(CONFIG . 'settings.json');
            if ($d) {
                $json = json_decode($d, true) ?? [];
            }
        }

        $data = $this->request->getData();

        $json['CustomSettings'][$key] = $data;

        file_put_contents(CONFIG . 'settings.json', json_encode($json));

        $this->set('data', $data);
        $this->viewBuilder()->setOption('serialize', 'data');
    }

    /**
     * Metadata method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function metadata()
    {

        $data = [
            'master_category_use' => Configure::read('Site.Settings.CategoryUseType'),
            'basic_display_show' => Configure::read('Site.Settings.BasicDisplayShow'),
        ];

        // 必要なマスタデータ等を追加していく

        $this->set('data', $data);
        $this->viewBuilder()->setOption('serialize', 'data');
    }
}
