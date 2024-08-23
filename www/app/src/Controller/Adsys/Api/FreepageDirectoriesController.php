<?php

declare(strict_types=1);

namespace App\Controller\Adsys\Api;

use App\Controller\AppController;
use App\Model\Entity\FreepageDirectory;
use Authorization\Exception\ForbiddenException;
use Cake\Core\Configure;
use Cake\Datasource\EntityInterface;
use Cake\Event\EventInterface;
use Cake\I18n\FrozenDate;
use Cake\Log\Log;
use Cake\Utility\Hash;
use Cake\Utility\Text;
use Medii\Crud\Interfaces\ConfirmInterface;
use Medii\Crud\Interfaces\CreateInterface;
use Medii\Crud\Interfaces\PreviewInterface;
use Medii\Crud\Interfaces\ReadInterface;
use Medii\Crud\Interfaces\SearchInterface;
use Medii\Crud\Interfaces\StatusInterface;
use Medii\Crud\Interfaces\UpdateInterface;

/**
 * FreepageDirectories Controller
 *
 * @property \App\Model\Table\FreepageDirectoriesTable $FreepageDirectories
 * @method \App\Model\Entity\FreepageDirectory[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class FreepageDirectoriesController extends AppController
{
    protected $defaultTable = 'FreepageDirectories';

    public $paginate = [
        'limit' => 20,
    ];

    public function initialize(): void
    {
        parent::initialize();

        $documentTable = $this->fetchTable('FreepageDocuments');
        $documentTable->changePrivate();
    }

    /**
     * Index method
     *
     * @param \Medii\Crud\Interfaces\SearchInterface $search
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function index(SearchInterface $search)
    {
        $associated = ['FreepageDocuments', 'FreepageDocuments.CreateAdmins', 'FreepageDocuments.ModifiedAdmins', 'CreateAdmins', 'ModifiedAdmins'];
        $search->setfindOptions(['contain' => $associated,]);
        $search->setFinder([
            ['finder' => 'ignoreRoot']
        ]);
        $this->set('data', $search->search($this));
    }
    /**
     * Index method
     *
     * @param \Medii\Crud\Interfaces\SearchInterface $search
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function all(SearchInterface $search)
    {
        $associated = ['FreepageDocuments', 'FreepageDocuments.CreateAdmins', 'FreepageDocuments.ModifiedAdmins', 'CreateAdmins', 'ModifiedAdmins'];
        $search->setfindOptions([
            'contain' => $associated,
            'order' => ['FreepageDirectories.lft' => 'ASC']
        ]);
        $this->set('data', ['data' => $search->query($this)]);
        $this->viewBuilder()->setOption('serialize', 'data');
    }

    /**
     * sequence method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function sequence()
    {
        $id = $this->request->getParam('id');
        $table = $this->fetchTable();
        $entity = $table->get($id);

        $user = $this->request->getAttribute('identity');
        if (!$user->can('view', $entity)) {
            throw new ForbiddenException();
        }

        // ドロップ先親ID
        $parentId = $this->request->getData('parent_id');
        // 上記の親IDのトップから数えたときのindex
        $index = $this->request->getData('number');

        // 別階層が対象の場合
        if ($entity->parent_id !== $parentId) {
            $entity->parent_id = $parentId;
            $entity = $table->saveOrFail($entity);
        }

        // 階層内の先頭へ移動
        $entity = $table->moveUp($entity, true);

        // トップ以外
        $entity = $table->moveDown($entity, $index);

        $this->set('data', $entity);
        $this->viewBuilder()->setOption('serialize', 'data');
    }

    /**
     * Add method
     *
     * @param \Medii\Crud\Interfaces\CreateInterface $create
     * @return \Cake\Http\Response|null|void Redirects on successful add, renders view otherwise.
     */
    public function add(CreateInterface $create)
    {
        // $associated = [];
        // $create->setPatchEntityOptions([
        //     'associated' => $associated
        // ]);

        $table = $this->fetchTable();
        $documentUuid = Text::uuid();
        $documentTable = $this->fetchTable('FreepageDocuments');

        $table->getEventManager()->on('Model.beforeSave', function (EventInterface $event, EntityInterface $entity) use ($documentUuid) {

            if ($entity instanceof FreepageDirectory) {
                if ($entity->type === Configure::read('Site.Settings.FreepageTypeKey.documentKey')) {
                    $entity->freepage_document_id = $documentUuid;
                }
            }
        });
        $table->getEventManager()->on('Model.afterSave', function (EventInterface $event, EntityInterface $entity) use ($documentUuid, $documentTable,) {

            if ($entity instanceof FreepageDirectory) {
                if ($entity->type === Configure::read('Site.Settings.FreepageTypeKey.documentKey')) {

                    $documentEntity = $documentTable->newEmptyEntity();
                    $documentEntity->id = $documentUuid;
                    $documentEntity->title = $entity->title;
                    $documentEntity->path = $entity->path;
                    $documentEntity->published = (new FrozenDate())->format('Y-m-d');
                    $documentEntity->created_by_admin = $entity->created_by_admin;
                    $documentEntity->modified_by_admin = $entity->modified_by_admin;
                    $metadataEntity = $documentTable->Metadatas->newEmptyEntity();
                    $metadataEntity->model = $documentTable->getAlias();
                    $documentEntity->metadata = $metadataEntity;
                    $documentTable->save($documentEntity);
                }
            }
        });

        $this->set('data', $create->save($this));
    }

    /**
     * Edit method
     *
     * @param \Medii\Crud\Interfaces\UpdateInterface $update
     * @return \Cake\Http\Response|null|void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function edit(UpdateInterface $update)
    {
        // $associated = [];
        // $update->setfindOptions(['contain' => $associated]);
        // $update->setPatchEntityOptions([
        //     'associated' => $associated
        // ]);

        $this->set('data', $update->save($this));
    }

    /**
     * Confirm method
     *
     * @param \Medii\Crud\Interfaces\ConfirmInterface $confirm
     * @return \Cake\Http\Response|null|void Redirects on successful confirm, renders view otherwise.
     */
    public function confirm(ConfirmInterface $confirm)
    {
        // $associated = [];
        // $confirm->setfindOptions(['contain' => $associated]);
        // $confirm->setPatchEntityOptions([
        //     'associated' => $associated
        // ]);

        $this->set('data', $confirm->confirm($this));
    }

    /**
     * View method
     *
     * @param \Medii\Crud\Interfaces\ReadInterface $read
     * @return \Cake\Http\Response|null|void Renders view
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function view(ReadInterface $read)
    {
        // $associated = [];
        // $read->setfindOptions(['contain' => $associated]);

        $this->set('data', $read->read($this));
    }

    /**
     * Preview method
     *
     * @param \Medii\Crud\Interfaces\PreviewInterface $preview
     * @return \Cake\Http\Response|null|void Renders view
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function preview(PreviewInterface $preview)
    {
        // $associated = [];
        // $preview->setfindOptions(['contain' => $associated]);

        return  $preview->preview($this);
    }

    /**
     * Status method
     *
     * @param \Medii\Crud\Interfaces\StatusInterface $status
     * @return \Cake\Http\Response|null|void Renders view
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function status(StatusInterface $status)
    {
        // $associated = [];
        // $status->setStatusOptions(['copyAssociated' => $associated, 'forceContain' => []]);

        $table = $this->fetchTable();
        $documentTable = $this->fetchTable('FreepageDocuments');
        $reqStatus = $this->request->getData('status');
        $reqIds = $this->request->getData('ids');

        $user = $this->request->getAttribute('identity');

        // 階層配下にもチェックがついているとエラーになるので、親階層のみ削除するように調整
        if ($reqStatus === Configure::read('Approvals.allStatusKey.deletedKey')) {
            $query = $table->find()->where([
                'FreepageDirectories.id IN ' => $reqIds
            ]);

            // 階層データは表示では必要なため、サーバサイドで自分が作成したもの以外は対象外にする
            if ($user->role === "Editor") {
                $query = $query->find('createdByAdmin', ['admin' => $user]);
            }

            $datas = $query->all();
            $newIds = [];

            foreach ($datas as $data) {
                $path = $table->find('path', ['for' => $data->parent_id])->find('ignoreRoot');
                if ($user->role === "Editor") {
                    $path = $path->find('createdByAdmin', ['admin' => $user]);
                }
                $exists = false;
                foreach ($path as $p) {
                    if (in_array($p->id, $reqIds, true)) {
                        $exists = true;
                        break;
                    }
                }
                if (!$exists) {
                    $newIds[] = $data->id;
                }
            }
            $reqIds = $newIds;

            $this->request = $this->request->withData('ids', $reqIds);
            $this->setRequest($this->request);
        }

        // 階層データは表示では必要なため、サーバサイドで自分が作成したもの以外は対象外にする
        if ($user->role === "Editor" && $reqStatus !== Configure::read('Approvals.allStatusKey.deletedKey')) {
            $reqIds = $this->request->getData('ids');
            $datas = $table->find()->where([
                'FreepageDirectories.id IN ' => $reqIds
            ])->find('createdByAdmin', ['admin' => $user])->all();
            $newIds = Hash::extract($datas->toArray(), '{n}.id');
            $reqIds = $newIds;

            $this->request = $this->request->withData('ids', $reqIds);
            $this->setRequest($this->request);
        }

        if (Configure::read('CustomSettings.Freepages.approve') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $this->AdminUtility->approvalMail(send: Configure::read('Site.Settings.Release'), roles: ['Editor'], content: 'フリーページ');
        }

        $table->getEventManager()->on('Model.beforeSave', ['priority' => 1], function (EventInterface $event, EntityInterface $entity) use ($reqStatus) {

            if ($entity instanceof FreepageDirectory) {
                if (
                    $reqStatus === Configure::read('Approvals.allStatusKey.copiedKey')
                ) {
                    if ($entity->type === Configure::read('Site.Settings.FreepageTypeKey.documentKey')) {
                        $entity->freepage_document_id = Text::uuid();
                        $entity->status = Configure::read('Approvals.allStatusKey.unpublishedKey');
                        $entity->public = Configure::read('Approvals.allStatusKey.unpublishedKey');
                    }
                    $entity->path = Text::uuid();
                }
            }
        });

        $table->getEventManager()->on('Model.afterSave', function (EventInterface $event, EntityInterface $entity) use ($documentTable,  $reqStatus, $user, $reqIds) {

            if ($entity instanceof FreepageDirectory) {

                if ($entity->type === Configure::read('Site.Settings.FreepageTypeKey.documentKey')) {

                    // コピー以外
                    if (
                        $reqStatus !== Configure::read('Approvals.allStatusKey.copiedKey')
                    ) {

                        // tableのaftersaveで更新がかかるため
                        if (in_array($entity->id, $reqIds, true)) {
                            $documentTable->setStatus([
                                'status' => $reqStatus,
                                'ids' => [$entity->freepage_document_id]
                            ], $user->role,);
                        }
                    }

                    // コピー
                    if (
                        $reqStatus === Configure::read('Approvals.allStatusKey.copiedKey')
                    ) {
                        // if (in_array($entity->id, $reqIds, true)) {
                        $oldDocumentEntity = $documentTable->get($entity->getOriginal('freepage_document_id'), [
                            'contain' => [
                                'Blocks', 'Metadatas'
                            ],
                        ]);
                        $oldDocumentArray = $oldDocumentEntity->toArray();
                        $oldDocumentArray['id'] = $entity->freepage_document_id;

                        $oldDocumentArray['title'] = $oldDocumentArray['title'] . '_copy_' . (new FrozenDate())->format('YmdHis');;
                        $oldDocumentArray['path'] = $entity->path;
                        $oldDocumentArray['status'] = $entity->status;
                        $oldDocumentArray['public'] = $entity->public;

                        $documentEntity = $documentTable->newEntity($oldDocumentArray, [
                            'associated' => [
                                'Blocks' => ['accessibleFields' => ['id' => false]],
                                'Metadatas' => ['accessibleFields' => ['id' => false]],
                            ]
                        ]);

                        $documentTable->save($documentEntity);
                        // }
                    }
                }
            }
        });
        $table->getEventManager()->on('Model.afterDelete', ['priority' => 3], function (EventInterface $event, EntityInterface $entity) use ($documentTable,  $reqStatus, $user, $reqIds) {

            if ($entity instanceof FreepageDirectory) {
                $table = $event->getSubject();
                // page
                if ($entity->type === Configure::read('Site.Settings.FreepageTypeKey.documentKey')) {

                    if ($documentTable->exists(['FreepageDocuments.id' => $entity->freepage_document_id])) {
                        $documentTable->setStatus([
                            'status' => $reqStatus,
                            'ids' => [$entity->freepage_document_id]
                        ], $user->role,);
                    }
                }
                // directory
                if ($entity->type === Configure::read('Site.Settings.FreepageTypeKey.directoryKey')) {

                    $ids = Configure::read("deleteChildDocuments.{$entity->id}");
                    if ($ids) {
                        foreach ($ids as $documentId) {
                            if ($documentTable->exists(['FreepageDocuments.id' => $documentId])) {
                                $documentTable->setStatus([
                                    'status' => $reqStatus,
                                    'ids' => [$documentId],
                                ], $user->role,);
                            }
                            $table
                                ->deleteAll(['id NOT IN ' => $reqIds, 'freepage_document_id' => $documentId]);
                        }

                        Configure::delete("deleteChildDocuments.{$entity->id}");
                    }
                }
            }
        });
        $table->getEventManager()->on('Model.beforeDelete', ['priority' => 3], function (EventInterface $event, EntityInterface $entity) use ($documentTable,  $reqStatus, $user, $reqIds) {

            if ($entity instanceof FreepageDirectory) {

                if ($entity->parent_id === "root") {
                    return false;
                }

                $table = $event->getSubject();
                // directory
                if ($entity->type === Configure::read('Site.Settings.FreepageTypeKey.directoryKey')) {

                    Configure::write("deleteChildDocuments.{$entity->id}", $table
                        ->find('children', ['for' => $entity->id])
                        ->find('treeList', [
                            'keyPath' => 'freepage_document_id',
                            'valuePath' => 'freepage_document_id',
                            'spacer' => ''
                        ])
                        ->find('document')
                        ->toArray());
                }
                if ($entity->type === Configure::read('Site.Settings.FreepageTypeKey.documentKey')) {
                    // 複数階層にまたがるページの削除処理、イベントを起こさないためにdeleteALL、削除予定の階層がすでにが含まれているとエラーになるので除外
                    $table
                        ->deleteAll(['id NOT IN ' => $reqIds, 'freepage_document_id' => $entity->freepage_document_id]);
                }
            }
        });

        $this->set('data', $status->status($this));
    }

    /**
     * Metadata method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function metadata()
    {
        $data = [];

        // 必要なマスタデータ等を追加していく
        $table = $this->fetchTable();
        $masterFreepageDirectories = $table->find('treeList')->find('directory');


        $data = [
            'master_freepage_directories' => $masterFreepageDirectories,
            'master_freepage_types' => Configure::read('Site.Settings.FreepageType'),

        ];

        $data['settings'] = Configure::read('CustomSettings.Freepages');

        $this->set('data', $data);
    }
}
