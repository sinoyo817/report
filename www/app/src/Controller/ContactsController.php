<?php

declare(strict_types=1);

namespace App\Controller;

use App\Controller\AppController;
use Cake\Core\Configure;
use Cake\Http\Exception\NotFoundException;
use Cake\ORM\Query;
use Medii\Crud\Interfaces\ConfirmInterface;
use Medii\Crud\Interfaces\CreateInterface;
use Medii\Crud\Interfaces\PreviewInterface;
use Medii\Crud\Interfaces\ReadInterface;
use Medii\Crud\Interfaces\SearchInterface;
use Medii\Crud\Interfaces\StatusInterface;
use Medii\Crud\Interfaces\UpdateInterface;

use Cake\Mailer\MailerAwareTrait;
use Josbeir\Filesystem\FilesystemAwareTrait;
use Cake\Event\EventInterface;
use Cake\Log\Log;
use Cake\Utility\Text;
use Medii\File\Model\Filter\FilesCollection;

use App\Utility\Formatters\ContactFormatter;
use Cake\ORM\Exception\PersistenceFailedException;
use Cake\Http\Exception\BadRequestException;

class ContactsController extends AppController
{
    use MailerAwareTrait, FilesystemAwareTrait;

    protected $defaultTable = 'Contacts';

    public function initialize(): void
    {
        parent::initialize();
        Configure::write("Site.Meta.Page.subject", "お問い合わせ");
        
        if (Configure::read('CustomSettings.Contacts.genre') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $MasterContactCategories = $this->fetchTable('MasterContactCategories')->find("list")->find('public')->order("sequence ASC")->toArray();
            $this->set(compact('MasterContactCategories'));
        }
        if (Configure::read('CustomSettings.Contacts.address') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $MasterPrefectures = $this->fetchTable('MasterPrefectures')->find("list")->order("sequence ASC")->toArray();
            $this->set(compact('MasterPrefectures'));
        }
        
        if (Configure::read('CustomSettings.Contacts.gender') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $Genders = Configure::read('Master.Genders');
            $this->set(compact('Genders'));
        }
    }

    public function beforeFilter(EventInterface $event)
    {
        parent::beforeFilter($event);
        $this->loadComponent('GoogleReCaptcha');
    }

    public function index()
    {
        $data = $this->Contacts->newEmptyEntity();

        if ($this->request->is('post')) {
            // if (!$this->GoogleReCaptcha->check()) {
            //     throw new BadRequestException();
            // }
            $data = $this->request->getSession()->read('Contacts.Add.Data');
            if (Configure::read('CustomSettings.Contacts.file') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey') && !empty($data->file_id)) {
                $data->file = $this->request->getSession()->read('Contacts.Add.File');
                $this->request->getSession()->delete('Contacts.Add.File');
            }
            $this->request->getSession()->delete('Contacts.Add.Data');
        }
        $this->set(compact('data'));
    }

        /**
     * confirm method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function confirm()
    {
        $this->response = $this->response->withDisabledCache();
        $this->request->allowMethod('POST');

        // if (!$this->GoogleReCaptcha->check()) {
        //     throw new BadRequestException();
        // }

        $table = $this->fetchTable();
        $userData = $this->Contacts->newEmptyEntity();

        $data = $table->patchEntity($userData, $this->request->getData());

        if (Configure::read('CustomSettings.Contacts.file') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey') && !empty($data->file_id)) {
            $data->file = $this->request->getSession()->read('Contacts.Add.File');
        }

        $this->set(compact('data'));

        if ($data->hasErrors()) {
            return $this->render('index');
        }
        if (isset($data['g-recaptcha-response']) && $data['g-recaptcha-response']) {
            unset($data['g-recaptcha-response']);
        }
        $this->request->getSession()->write('Contacts.Add.Data', $data);
    }

    /**
     * complete method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function complete()
    {
        $this->response = $this->response->withDisabledCache();
        $this->request->allowMethod('POST');

        if (!$this->request->getSession()->check('Contacts.Add.Data')) {
            throw new BadRequestException('不正なアクセスです');
        }

        $data = $this->request->getSession()->read('Contacts.Add.Data');

        $table = $this->fetchTable();

        try {
            $saveData = $table->saveOrFail($data);
            $MasterPrefectures = [];
            if (Configure::read('CustomSettings.Contacts.title') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey') && 
                Configure::read('CustomSettings.Contacts.email') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) 
            {
                if (Configure::read('CustomSettings.Contacts.file') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey') && !empty($data->file_id)) {
                    $fileTable = $this->fetchTable('Medii/File.Files');
                    $file = $fileTable->find()->where(['Files.id' => $data->file_id])->firstOrFail();
                    $data->file = $file;
                }
                if (Configure::read('CustomSettings.Contacts.address') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
                    $MasterPrefectures = $this->fetchTable('MasterPrefectures')->find("list")->order("sequence ASC")->toArray();
                }
                $this->getMailer('Contact')->send('complete', [$data, $MasterPrefectures]);
                $this->getMailer('Contact')->send('completeForAdmin', [$data, $MasterPrefectures]);
            }

            // 色々削除
            $table->delete($data);
            $this->request->getSession()->delete('Contacts.Add.Data');
            // if (Configure::read('CustomSettings.Contacts.file') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey') && !empty($data->file_id)) {
            //     $fileTable = $this->fetchTable('Medii/File.Files');
            //     $del = $fileTable->find()->where(['Files.id' => $data->file_id])->firstOrFail();
            //     $fileTable->delete($del);
            // }

        } catch (PersistenceFailedException $e) {
            Log::error($e->getMessage());
        }
    }

    public function upload()
    {
        $file = $this->request->getData('file');
        $model = $this->request->getData('model');
        $user = $this->request->getAttribute('identity');

        $uuid = Text::uuid();
        try {
            $fileEntity = $this->getFilesystem('contact')
                ->setFormatter(ContactFormatter::class)
                ->upload($file, [
                    'uuid' => $uuid,
                    'request' => $this->request,
                ]
            );
        } catch (FilesystemException | UnableToWriteFile $exception) {
            // handle the error
            Log::error($exception->getMessage());
            $statusCode = 422;
            $this->response = $this->response->withStatus($statusCode);

            $violations = [
                [
                    'messages' => [__('ファイルのアップロードに失敗しました')],
                    'propertyPath' => 'upload',
                ],
            ];
            $this->set('violations', $violations);
            $this->viewBuilder()->setOption('serialize', 'violations');
            return;
        }

        $fileArray = $fileEntity->toArray();
        $fileArray['id'] = $uuid;
        // $fileArray['created_by_user'] = $user->id;
        $fileArray['model'] = $model;

        $table = $this->fetchTable('Medii/File.Files');
        $entity = $table->newEntity($fileArray);

        try {
            $data = $table->saveOrFail($entity);
            $this->set('data', $data);
            $this->viewBuilder()->setOption('serialize', 'data');
            $this->request->getSession()->write('Contacts.Add.File', $data);
        } catch (\Cake\ORM\Exception\PersistenceFailedException $exception) {
            // echo $e->getEntity();
            Log::error($exception->getMessage());
            $statusCode = 422;
            $this->response = $this->response->withStatus($statusCode);

            $violations = [
                [
                    'messages' => [__('ファイルのアップロードに失敗しました')],
                    'propertyPath' => 'upload',
                ],
            ];
            $this->set('violations', $violations);
            $this->viewBuilder()->setOption('serialize', 'violations');
        }
    }
}
