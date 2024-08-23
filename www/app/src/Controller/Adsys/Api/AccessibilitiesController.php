<?php

declare(strict_types=1);

namespace App\Controller\Adsys\Api;

use App\Controller\AppController;
use App\Controller\Component\AdminUtilityComponent;
use Authentication\PasswordHasher\DefaultPasswordHasher;
use Cake\Core\Configure;
use Cake\Datasource\Exception\RecordNotFoundException;
use Cake\Event\EventInterface;
use Cake\Http\Client;
use Cake\Http\Exception\BadRequestException;
use Cake\Http\Exception\UnauthorizedException;
use Cake\Log\Log;

/**
 * Admins Controller
 *
 * @method \App\Model\Entity\Admin[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class AccessibilitiesController extends AppController
{

    public function initialize(): void
    {
        $this->loadComponent('AdminUtility', ['ignoreTable' => true]);
        parent::initialize();
        // $this->loadComponent('AdminUtility', ['ignoreTable' => true]);
        // $this->AdminUtility->setConfig('ignoreTable', true);
    }

    public function beforeFilter(EventInterface $event)
    {
        parent::beforeFilter($event);
    }

    /**
     * link method
     *
     * @return \Cake\Http\Response
     * @throws BadRequestException|UnauthorizedException
     */
    public function link()
    {
        $this->request->allowMethod('POST');

        if (!$this->request->is('ajax')) {
            throw new BadRequestException();
        }

        $url = $this->request->getData('url');

        $client = new Client();

        $status = false;
        try {
            $responce = $client->head($url, options: ['timeout' => 10]);
            if ($responce->isOk()) {
                $status = true;
            }
        } catch (\Psr\Http\Client\ClientExceptionInterface $e) {
            Log::error($e->getMessage());
        }

        $data = [
            'status' => $status,
        ];

        $this->set('data', $data);
        $this->viewBuilder()->setOption('serialize', 'data');
    }
    /**
     * gif method
     *
     * @return \Cake\Http\Response
     * @throws BadRequestException|UnauthorizedException
     */
    public function gif()
    {
        $this->request->allowMethod('POST');

        if (!$this->request->is('ajax')) {
            throw new BadRequestException();
        }

        $id = $this->request->getData('file_id');

        $table = $this->fetchTable('Medii/File.Files');

        $filePathPrefix = Configure::read("Filesystem.settings.basePath") . Configure::read("Filesystem.settings.fileDirectory") . DS;
        $isFilePath = strpos($id, $filePathPrefix) !== false;

        $status = false;
        try {
            if ($isFilePath) {
                $filePath = str_replace($filePathPrefix, "", $id);
                $fileEntity = $table->find()->where(["{$table->getAlias()}.path" => urldecode($filePath)])->firstOrFail();
            } else {
                $fileEntity = $table->find()->where(["{$table->getAlias()}.id" => $id])->firstOrFail();
            }
            $path = Configure::read("Filesystem.settings.privateFilePath") . '/' . $fileEntity->path;
            $status = $this->checkGif($path);
        } catch (RecordNotFoundException $e) {
            //
            Log::error($e->getMessage() . " ID : {$id}");
        }


        $data = [
            'status' => $status,
        ];

        $this->set('data', $data);
        $this->viewBuilder()->setOption('serialize', 'data');
    }

    /**
     * checkGif function
     *
     * @param string $data
     * @return void
     */
    private function checkGif($data)
    {

        if (!empty($data)) {
            if (!file_exists($data)) {
                // ファイルが無い
                return false;
            }

            if (!($fp = fopen($data, "rb"))) return true;
            $head = fread($fp, 6);
            if (!preg_match("/^GIF89a/", $head)) {
                return true;
            }

            $gce_cnt = 0;
            while (!feof($fp)) {
                if (bin2hex(fread($fp, 1)) != "21") continue;
                switch (bin2hex(fread($fp, 2))) {
                    case "f904": // Graphic Control Extension
                        $gce_cnt++;
                        if ($gce_cnt > 1) {
                            fclose($fp);
                            unset($gce_cnt);
                            return false;
                        }
                        break;
                }
            }
            fclose($fp);
            unset($gce_cnt);
            return true;
        }
        return true;
    }
}
