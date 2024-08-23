<?php

declare(strict_types=1);

namespace App\Controller\AdsysMng\Api;

use App\Controller\AppController;
use Cake\Core\Configure;
use Cake\Log\Log;
use Cake\Utility\Hash;
use Cake\Utility\Inflector;
use Medii\Crud\Interfaces\ConfirmInterface;
use Medii\Crud\Interfaces\CreateInterface;
use Medii\Crud\Interfaces\PreviewInterface;
use Medii\Crud\Interfaces\ReadInterface;
use Medii\Crud\Interfaces\SearchInterface;
use Medii\Crud\Interfaces\StatusInterface;
use Medii\Crud\Interfaces\UpdateInterface;

/**
 * Approvals Controller
 *
 * @method \App\Model\Entity\Approval[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class ApprovalsController extends AppController
{


    public function accessView()
    {
        $this->_getAuthFileData("Roles");
    }

    public function accessUpdate()
    {
        $this->_updateAuthFileData("Roles");
    }


    protected function _getAuthFileData($key)
    {

        try {
            $data = Configure::readOrFail("{$key}");
        } catch (\RuntimeException $e) {
            $data = [];
        }

        if ($key === "Roles" && $data) {
            $formatData = [];
            foreach ($data as $roleKey => $item) {
                $contentsData = [];
                foreach (Configure::read('Site.Settings.ContentsList') as $contentsKey => $contentsTitle) {
                    $contentsKey = Inflector::dasherize($contentsKey);
                    $enabled = in_array($contentsKey, $item['requireRoutesKey'], true);

                    $contentsData[$contentsKey]['enabled'] = $enabled ? Configure::read('Site.Settings.BasicDisplayShowKey.onKey') : Configure::read('Site.Settings.BasicDisplayShowKey.offKey');
                    if (array_key_exists($contentsKey, $item['statusOptions'])) {
                        $contentsData[$contentsKey]['options'] = $item['statusOptions'][$contentsKey];
                    }
                }

                $formatData[$roleKey] = $contentsData;
                $formatData[$roleKey]['defaultStatusOption'] = $item['statusOptions']['default'];
            }
            $data = $formatData;
        }

        $this->set('data', $data);
        $this->viewBuilder()->setOption('serialize', 'data');
    }

    protected function _updateAuthFileData($key)
    {

        $json = [];
        if (file_exists(CONFIG . 'auth.json')) {
            $d = file_get_contents(CONFIG . 'auth.json');
            if ($d) {
                $json = json_decode($d, true) ?? [];
            }
        }

        $data = $this->request->getData();

        if ($key === "Roles" && $data) {
            $formatData = [];
            foreach ($data as $roleKey => $item) {
                $formatData[$roleKey]['requireRoutesKey'] = [];
                foreach ($item as $contentsKey => $req) {
                    if ($contentsKey === "defaultStatusOption") {
                        $formatData[$roleKey]['statusOptions']['default'] = $req;
                    } else {
                        if ($req['enabled'] === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
                            $formatData[$roleKey]['requireRoutesKey'][] = $contentsKey;
                        }
                        if (isset($req['options']) && $req['options']) {
                            $formatData[$roleKey]['statusOptions'][$contentsKey] = $req['options'];
                        }
                    }
                }
            }
            $data = $formatData;
        }

        $json[$key] = $data;

        file_put_contents(CONFIG . 'auth.json', json_encode($json));

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

        $formatAllContents = [];
        foreach (Configure::read('Site.Settings.ContentsList') as $key => $val) {
            $formatAllContents[Inflector::dasherize($key)] = $val;
        }

        $data = [
            'all_roles' => Configure::read('Approvals.allRoles'),
            'all_contents' => $formatAllContents,
            'all_status_options' => Configure::read('Approvals.allStatusOptionTitle'),
            'basic_display_show' => Configure::read('Site.Settings.BasicDisplayShow'),
        ];

        // 必要なマスタデータ等を追加していく

        $this->set('data', $data);
        $this->viewBuilder()->setOption('serialize', 'data');
    }
}
