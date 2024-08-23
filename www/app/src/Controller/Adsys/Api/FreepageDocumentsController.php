<?php

declare(strict_types=1);

namespace App\Controller\Adsys\Api;

use App\Controller\AppController;
use App\Model\Entity\FreepageDocument;
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
 * FreepageDocuments Controller
 *
 * @property \App\Model\Table\FreepageDocumentsTable $FreepageDocuments
 * @method \App\Model\Entity\FreepageDocument[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class FreepageDocumentsController extends AppController
{
    protected $defaultTable = 'FreepageDocuments';

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
        // $associated = [];
        // $search->setfindOptions(['contain' => $associated]);
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
        $commonAssociated = ['Blocks', 'Metadatas', 'FreepageDirectories'];
        $findAssociated = $commonAssociated;
        $patchAssociated = $commonAssociated;


        $update->setfindOptions(['contain' => $findAssociated]);
        $update->setPatchEntityOptions([
            'associated' => $patchAssociated
        ]);

        $table = $this->fetchTable();
        $table->getEventManager()->on('Model.beforeMarshal', function (EventInterface $event, $data) {

            if (isset($data['freepage_directories']) && !isset($data['freepage_directories']['_ids'])) {
                $data['freepage_directories']['_ids'] = $data['freepage_directories'];
                //
            }
        });
        $table->getEventManager()->on('Model.beforeSave', function (EventInterface $event, EntityInterface $entity) {

            if ($entity instanceof FreepageDocument) {
                $entity->status = 'draft';
            }
        });

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
        $commonAssociated = ['Blocks', 'Metadatas', 'FreepageDirectories'];
        $findAssociated = $commonAssociated;
        $patchAssociated = $commonAssociated;

        $confirm->setfindOptions(['contain' => $findAssociated]);
        $confirm->setPatchEntityOptions([
            'associated' => $patchAssociated
        ]);

        $table = $this->fetchTable();
        $table->getEventManager()->on('Model.beforeMarshal', function (EventInterface $event, $data) {

            if (isset($data['freepage_directories']) && !isset($data['freepage_directories']['_ids'])) {
                $data['freepage_directories']['_ids'] = $data['freepage_directories'];
                //
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
        $associated = ['Blocks', 'Metadatas', 'FreepageDirectories'];
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
        $associated = ['Blocks', 'Blocks.File01', 'Blocks.File02', 'Metadatas', 'Metadatas.Files', 'FreepageDirectories'];

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
        $associated = ['Blocks', 'Metadatas'];
        $status->setStatusOptions(['copyAssociated' => $associated, 'forceContain' => []]);

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

        $table = $this->fetchTable('FreepageDirectories');
        $table->changePrivate();
        $masterFreepageDirectories = $table->find('treeList', [
            'spacer' => '$'
        ])->find('directory');
        // $masterFreepageDirectories = $table->find('threaded')->select(['id', 'title', 'parent_id'])->find('directory');

        $data = [
            'master_freepage_directories' => $masterFreepageDirectories,

        ];
        $data['settings'] = Configure::read('CustomSettings.Freepages');
        // 必要なマスタデータ等を追加していく

        $this->set('data', $data);
    }
}
