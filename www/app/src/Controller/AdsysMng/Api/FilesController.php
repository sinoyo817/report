<?php

declare(strict_types=1);

namespace App\Controller\AdsysMng\Api;

use App\Controller\AppController;
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
use Medii\File\Model\Entity\File;
use Medii\File\Model\Filter\FilesCollection;

/**
 * Files Controller
 *
 * @method \App\Model\Entity\File[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class FilesController extends AppController
{
    protected $defaultTable = 'Medii/File.Files';

    public $paginate = [
        'limit' => 20,
    ];

    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('AdminUtility');
    }


    /**
     * Index method
     *
     * @param \Medii\Crud\Interfaces\SearchInterface $search
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function index(SearchInterface $search)
    {
        // $associated = [];
        // $search->setfindOptions(['contain' => $associated]);
        $search->setCollection(FilesCollection::class);
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
        // $associated = [];
        // $create->setPatchEntityOptions([
        //     'associated' => $associated
        // ]);

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

        $fileFieldsTable = $this->fetchTable('Medii/File.FileFields');

        $table->getEventManager()->on('Model.beforeDelete', function (EventInterface $event, EntityInterface $entity) use ($fileFieldsTable) {

            if ($entity instanceof File) {
                if ($entity->status === "published") {
                    return false;
                }
            }
        });
        $table->getEventManager()->on('Model.afterDelete', function (EventInterface $event, EntityInterface $entity) use ($fileFieldsTable) {

            if ($entity instanceof File) {
                $fileId = $entity->id;
                $fileFieldsTable->deleteAll(['file_id' => $fileId]);
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
        $data = [
            'all_contents' => Configure::read('Site.Settings.ContentsList'),
        ];

        // 必要なマスタデータ等を追加していく

        $this->set('data', $data);
    }
}
