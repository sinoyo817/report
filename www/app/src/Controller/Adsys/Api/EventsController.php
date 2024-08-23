<?php

declare(strict_types=1);

namespace App\Controller\Adsys\Api;

use App\Controller\AppController;
use App\Model\Entity\Event;
use App\Model\Table\MasterEventCategoriesTable;
use Cake\Chronos\Chronos;
use Cake\Core\Configure;
use Cake\Datasource\EntityInterface;
use Cake\Event\EventInterface;
use Medii\Crud\Interfaces\ConfirmInterface;
use Medii\Crud\Interfaces\CreateInterface;
use Medii\Crud\Interfaces\PreviewInterface;
use Medii\Crud\Interfaces\ReadInterface;
use Medii\Crud\Interfaces\SearchInterface;
use Medii\Crud\Interfaces\StatusInterface;
use Medii\Crud\Interfaces\UpdateInterface;

/**
 * Events Controller
 *
 * @property \App\Model\Table\EventsTable $Events
 * @method \App\Model\Entity\Event[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class EventsController extends AppController
{
    protected $defaultTable = 'Events';

    public $paginate = [
        'limit' => 20,
    ];

    /**
     * Index method
     *
     * @param \Medii\Crud\Interfaces\SearchInterface $search
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function index(SearchInterface $search)
    {
        $associated = [
            'CreateAdmins',
            'ModifiedAdmins'
        ];
        if (Configure::read('CustomSettings.Events.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated[] = 'MasterEventCategories';
        }
        if (Configure::read('CustomSettings.Events.area') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated[] = 'MasterAreas';
        }
        if (Configure::read('CustomSettings.Events.approve') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $associated[] = 'CreateUsers';
            $associated[] = 'ModifiedUsers';
            $associated[] = 'ApprovalRemands';
            $associated[] = 'ApprovalRemands.CreateAdmins';
        }
        $search->setfindOptions(['contain' => $associated]);
        $this->set('data', $search->search($this));
    }

    /**
     * Add method
     *
     * @param \Medii\Crud\Interfaces\CreateInterface $create
     * @return \Cake\Http\Response|null|void Redirects on successful add, renders view otherwise.
     */
    public function add(CreateInterface $create)
    {
        $associated = [
            'EventImages',
            'EventLinks',
            'EventFiles',
            'Metadatas',
            'EventDates',
        ];
        // エリア複数
        if (Configure::read('CustomSettings.Events.area') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey')) {
            $associated[] = "MasterAreas";
        }
        // カテゴリ複数
        if (Configure::read('CustomSettings.Events.category') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey')) {
            $associated[] = "MasterEventCategories";
        }
        $create->setPatchEntityOptions([
            'associated' => $associated
        ]);

        $user = $this->Authentication->getIdentity();

        $table = $this->fetchTable();
        $table->getEventManager()->on('Model.beforeMarshal', function (EventInterface $event, $data) {

            if (
                Configure::read('CustomSettings.Events.area') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey') &&
                isset($data['master_areas']) && !isset($data['master_areas']['_ids'])
            ) {
                $data['master_areas']['_ids'] = $data['master_areas'];
            }
            if (
                Configure::read('CustomSettings.Events.category') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey') &&
                isset($data['master_event_categories']) && !isset($data['master_event_categories']['_ids'])
            ) {
                $data['master_event_categories']['_ids'] = $data['master_event_categories'];
            }
        });
        $table->getEventManager()->on('Model.beforeSave', function (EventInterface $event, EntityInterface $entity) use ($user) {

            if ($entity instanceof Event) {
                $entity->status = 'draft';
                $now = new Chronos();
                if ($user->role === 'Admin') {
                    $entity->modified_admin = $now->format('Y-m-d H:i:s');
                } else {
                    $entity->modified_user = $now->format('Y-m-d H:i:s');
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
        $commonAssociated = [
            'EventImages',
            'EventLinks',
            'EventFiles',
            'Metadatas',
            'EventDates',
        ];
        $findAssociated = $commonAssociated;
        $patchAssociated = $commonAssociated;

        // エリア複数
        if (Configure::read('CustomSettings.Events.area') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey')) {
            $findAssociated[] = "MasterAreas";
            $patchAssociated[] = "MasterAreas";
        }
        // カテゴリ複数
        if (Configure::read('CustomSettings.Events.category') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey')) {
            $findAssociated[] = "MasterEventCategories";
            $patchAssociated[] = "MasterEventCategories";
        }

        $findAssociated[] = 'EventImages.File01';
        $findAssociated[] = 'EventFiles.File01';
        $findAssociated[] = 'Files';
        $update->setfindOptions(['contain' => $findAssociated]);
        $update->setPatchEntityOptions([
            'associated' => $patchAssociated
        ]);

        $user = $this->Authentication->getIdentity();

        $table = $this->fetchTable();
        $table->getEventManager()->on('Model.beforeMarshal', function (EventInterface $event, $data) {

            if (
                Configure::read('CustomSettings.Events.area') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey') &&
                isset($data['master_areas']) && !isset($data['master_areas']['_ids'])
            ) {
                $data['master_areas']['_ids'] = $data['master_areas'];
            }
            if (
                Configure::read('CustomSettings.Events.category') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey') &&
                isset($data['master_event_categories']) && !isset($data['master_event_categories']['_ids'])
            ) {
                $data['master_event_categories']['_ids'] = $data['master_event_categories'];
            }
        });
        $table->getEventManager()->on('Model.beforeSave', function (EventInterface $event, EntityInterface $entity) use ($user) {

            if ($entity instanceof Event) {
                $entity->status = 'draft';
                $now = new Chronos();
                if ($user->role === 'Admin') {
                    $entity->modified_admin = $now->format('Y-m-d H:i:s');
                } else {
                    $entity->modified_user = $now->format('Y-m-d H:i:s');
                }
            }
        });


        $this->set('data', $update->save($this));
    }

    /**
     * OnlyEdit method
     *
     * @param \Medii\Crud\Interfaces\UpdateInterface $update
     * @return \Cake\Http\Response|null|void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function onlyEdit(UpdateInterface $update)
    {
        $associated = [];
        $update->setfindOptions(['contain' => $associated]);
        $update->setPatchEntityOptions([
            'associated' => $associated,
            'validate' => false
        ]);

        $data = $update->save($this);
        $this->set('data', $data);

        $this->viewBuilder()->setOption('serialize', 'data');

        if ($data->public === "published") {
            $table = $this->fetchTable();
            $table->changePublic();

            $entity = $table->patchEntity($table->get($data->id), $this->request->getData());
            $table->saveOrFail(($entity));

            $table->changePrivate();
        }
    }

    /**
     * Confirm method
     *
     * @param \Medii\Crud\Interfaces\ConfirmInterface $confirm
     * @return \Cake\Http\Response|null|void Redirects on successful confirm, renders view otherwise.
     */
    public function confirm(ConfirmInterface $confirm)
    {
        $commonAssociated = [
            'EventImages',
            'EventLinks',
            'EventFiles',
            'Metadatas',
            'EventDates',
        ];
        $findAssociated = $commonAssociated;
        $patchAssociated = $commonAssociated;

        // エリア複数
        if (Configure::read('CustomSettings.Events.area') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey')) {
            $findAssociated[] = "MasterAreas";
            $patchAssociated[] = "MasterAreas";
        } else if (Configure::read('CustomSettings.Events.area') === Configure::read('Site.Settings.CategoryUseTypeKey.singleKey')) {
            $findAssociated[] = "MasterAreas";
        }
        // カテゴリ複数
        if (Configure::read('CustomSettings.Events.category') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey')) {
            $findAssociated[] = "MasterEventCategories";
            $patchAssociated[] = "MasterEventCategories";
        } else if (Configure::read('CustomSettings.Events.category') === Configure::read('Site.Settings.CategoryUseTypeKey.singleKey')) {
            $findAssociated[] = "MasterEventCategories";
        }

        $findAssociated[] = 'EventImages.File01';
        $findAssociated[] = 'EventFiles.File01';
        $findAssociated[] = 'Files';
        $confirm->setfindOptions(['contain' => $findAssociated]);
        $confirm->setPatchEntityOptions([
            'associated' => $patchAssociated
        ]);

        $table = $this->fetchTable();
        $table->getEventManager()->on('Model.beforeMarshal', function (EventInterface $event, $data) {

            if (
                Configure::read('CustomSettings.Events.area') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey') &&
                isset($data['master_areas']) && !isset($data['master_areas']['_ids'])
            ) {
                $data['master_areas']['_ids'] = $data['master_areas'];
            }
            if (
                Configure::read('CustomSettings.Events.category') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey') &&
                isset($data['master_event_categories']) && !isset($data['master_event_categories']['_ids'])
            ) {
                $data['master_event_categories']['_ids'] = $data['master_event_categories'];
            }
        });


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
        $associated = [
            'EventImages',
            'EventImages.File01',
            'EventLinks',
            'EventFiles',
            'EventFiles.File01',
            'Metadatas',
            'EventDates',
            'Files',
        ];
        // エリア
        if (Configure::read('CustomSettings.Events.area') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated[] = "MasterAreas";
        }
        // カテゴリ
        if (Configure::read('CustomSettings.Events.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated[] = "MasterEventCategories";
        }
        $read->setfindOptions(['contain' => $associated]);

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
        $associated = [
            'EventImages',
            'EventImages.File01',
            'EventLinks',
            'EventFiles',
            'EventFiles.File01',
            'Metadatas',
            'EventDates',
            'Files',
        ];
        // エリア
        if (Configure::read('CustomSettings.Events.area') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated[] = "MasterAreas";
        }
        // カテゴリ
        if (Configure::read('CustomSettings.Events.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated[] = "MasterEventCategories";
        }
        $preview->setfindOptions(['contain' => $associated]);

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
        if (Configure::read('CustomSettings.Events.approve') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $this->AdminUtility->approvalMail(send: Configure::read('Site.Settings.Release'), roles: ['Editor'], content: 'イベント');
        }

        $associated = [
            'EventImages',
            'EventLinks',
            'EventFiles',
            'Metadatas',
            'EventDates',
        ];
        // エリア
        if (Configure::read('CustomSettings.Events.area') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey')) {
            $associated[] = "MasterAreasEvents";
        }
        // カテゴリ
        if (Configure::read('CustomSettings.Events.category') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey')) {
            $associated[] = "MasterEventCategoriesEvents";
        }
        $status->setStatusOptions(['copyAssociated' => $associated]);

        $this->set('data', $status->status($this));
    }

    /**
     * Metadata method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function metadata()
    {
        $data  = [];
        $data['settings'] = Configure::read('CustomSettings.Events');

        if (Configure::read('CustomSettings.Events.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $table = $this->fetchTable('MasterEventCategories');
            $masterEventCategories = $table->find()->find('public')->select(['id', 'title']);
            $data['master_event_categories'] = $masterEventCategories;
        }
        if (Configure::read('CustomSettings.Events.area') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $table = $this->fetchTable('MasterAreas');
            $masterAreas = $table->find()->find('public')->select(['id', 'title']);
            $data['master_areas'] = $masterAreas;
        }

        $data['types'] = Configure::read('Master.Events.Type');


        // 必要なマスタデータ等を追加していく

        $this->set('data', $data);
    }
}
