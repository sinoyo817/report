<?php

declare(strict_types=1);

namespace App\Controller\AdsysMng\Api;

use App\Controller\AppController;
use Cake\Core\Configure;
use Medii\Crud\Interfaces\ConfirmInterface;
use Medii\Crud\Interfaces\CreateInterface;
use Medii\Crud\Interfaces\PreviewInterface;
use Medii\Crud\Interfaces\ReadInterface;
use Medii\Crud\Interfaces\SearchInterface;
use Medii\Crud\Interfaces\StatusInterface;
use Medii\Crud\Interfaces\UpdateInterface;

/**
 * Admins Controller
 *
 * @property \App\Model\Table\AdminsTable $Admins
 * @method \App\Model\Entity\Admin[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class AdminsController extends AppController
{
    protected $defaultTable = 'Admins';

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
        $confirm->ignorePublicView();

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
        $role = [];
        foreach (Configure::read('Approvals.allRoles') as $key => $title) {
            $role[] = [
                'role' => $key,
                'title' => $title,
            ];
        }

        $data = [
            'role' => $role,
        ];

        // 必要なマスタデータ等を追加していく

        $this->set('data', $data);
    }
}
