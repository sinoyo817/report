<?php

declare(strict_types=1);

namespace App\Controller\AdsysMng\Api;

use App\Controller\AppController;
use Cake\Core\Configure;
use Cake\Log\Log;
use Josbeir\Filesystem\FilesystemAwareTrait;
use League\Flysystem\StorageAttributes;
use Migrations\Migrations;

/**
 * Resets Controller
 *
 * @method \App\Model\Entity\Reset[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class ResetsController extends AppController
{
    use FilesystemAwareTrait;

    public function reset()
    {

        $this->_tableReset();
        $this->_configReset();
        $this->_fileReset();

        $data = [];
        $data['status'] = true;

        $this->set('data', $data);
        $this->viewBuilder()->setOption('serialize', 'data');
    }

    private function _tableReset()
    {
        // admin以外はMigrationで初期化
        $migration = new Migrations();
        // rollback
        foreach (Configure::read('Site.Settings.Reset.Migration.rollback') as $option) {
            $migration->rollback($option);
        }
        // migrate
        foreach (Configure::read('Site.Settings.Reset.Migration.migrate') as $option) {
            $migration->migrate($option);
        }
        if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            // rollback
            foreach (Configure::read('Site.Settings.Reset.Migration.i18nRollback') as $option) {

                $migration->rollback($option);
            }
            // migrate
            foreach (Configure::read('Site.Settings.Reset.Migration.i18nMigrate') as $option) {
                $migration->migrate($option);
            }
        }
        $migration->seed();

        $adminTable = $this->fetchTable('Admins');
        $adminTable->deleteAll(['superuser' => 0]);
    }

    private function _configReset()
    {
        // Configファイル削除
        if (file_exists(CONFIG . 'settings.json')) {
            unlink(CONFIG . 'settings.json');
        }
        if (file_exists(CONFIG . 'auth.json')) {
            unlink(CONFIG . 'auth.json');
        }
    }

    private function _fileReset()
    {
        // ファイル削除
        // 公開側Files
        $fileSystem = $this->getFilesystem('public')->getDisk();
        $allFiles = $fileSystem->listContents('/')->filter(function (StorageAttributes $attributes) {
            return $attributes->path() !== '.htaccess';
        })->toArray();
        if ($allFiles) {
            foreach ($allFiles as $file) {
                if ($file->type() === "dir") {
                    $fileSystem->deleteDirectory($file->path());
                } else {
                    $fileSystem->delete($file->path());
                }
            }
        }
        // 非公開側Files
        $fileSystem = $this->getFilesystem()->getDisk();
        $allFiles = $fileSystem->listContents('/')->filter(function (StorageAttributes $attributes) {
            return $attributes->path() !== '.gitkeep';
        })->toArray();
        if ($allFiles) {
            foreach ($allFiles as $file) {
                if ($file->type() === "dir") {
                    $fileSystem->deleteDirectory($file->path());
                } else {
                    $fileSystem->delete($file->path());
                }
            }
        }
        // 公開側Assets
        $fileSystem = $this->getFilesystem('assetPublic')->getDisk();
        $allFiles = $fileSystem->listContents('/')->filter(function (StorageAttributes $attributes) {
            return $attributes->path() !== '.gitkeep';
        })->toArray();
        if ($allFiles) {
            foreach ($allFiles as $file) {
                if ($file->type() === "dir") {
                    $fileSystem->deleteDirectory($file->path());
                } else {
                    $fileSystem->delete($file->path());
                }
            }
        }
        // 非公開側Assets
        $fileSystem = $this->getFilesystem('assetPrivate')->getDisk();
        $allFiles = $fileSystem->listContents('/')->filter(function (StorageAttributes $attributes) {
            return $attributes->path() !== '.gitkeep';
        })->toArray();
        if ($allFiles) {
            foreach ($allFiles as $file) {
                if ($file->type() === "dir") {
                    $fileSystem->deleteDirectory($file->path());
                } else {
                    $fileSystem->delete($file->path());
                }
            }
        }
    }
}
