<?php

declare(strict_types=1);

namespace App\Controller\Adsys\Api;

use App\Controller\AppController;
use App\Controller\Component\AdminUtilityComponent;
use Authentication\PasswordHasher\DefaultPasswordHasher;
use Cake\Core\Configure;
use Cake\Event\EventInterface;
use Cake\Http\Exception\BadRequestException;
use Cake\Http\Exception\UnauthorizedException;
use Cake\ORM\Exception\PersistenceFailedException;
use Cake\Routing\Router;
use Cake\Utility\Hash;
use Medii\Crud\Interfaces\ConfirmInterface;
use Medii\Crud\Interfaces\CreateInterface;
use Medii\Crud\Interfaces\ReadInterface;
use Medii\Crud\Interfaces\SearchInterface;
use Medii\Crud\Interfaces\StatusInterface;
use Medii\Crud\Interfaces\UpdateInterface;

/**
 * Admins Controller
 *
 * @method \App\Model\Entity\Admin[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class AdminsController extends AppController
{
    protected $defaultTable = 'Admins';

    public $paginate = [
        'limit' => 20,
        'order' => [
            'Admins.cid' => 'DESC',
        ],
    ];

    public function beforeFilter(EventInterface $event)
    {
        parent::beforeFilter($event);
    }

    /**
     * Index method
     *
     * @param \Medii\Crud\Interfaces\SearchInterface $search
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function index(SearchInterface $search)
    {
        $associated = ['MasterGroup'];
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
     * Status method
     *
     * @param \Medii\Crud\Interfaces\StatusInterface $status
     * @return \Cake\Http\Response|null|void Renders view
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function status(StatusInterface $status)
    {
        // $associated = [];
        // $status->setStatusOptions(['copyAssociated' => $associated]);

        $this->set('data', $status->status($this));
    }

    /**
     * metadata method
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

        $table = $this->fetchTable('MasterGroups');
        $groups = $table->find()->find('public')->select(['id', 'title'])->order(['sequence ASC']);

        $data = [
            'role' => $role,
            'groups' => $groups,
        ];

        $this->set('data', $data);
    }


    /**
     * auth method
     *
     * @return \Cake\Http\Response
     * @throws BadRequestException|UnauthorizedException
     */
    public function auth()
    {
        $this->request->allowMethod('GET');

        if (!$this->request->is('ajax')) {
            throw new BadRequestException();
        }
        $result = $this->Authentication->getResult();

        if ($result && $result->isValid()) {
            $data = [
                'title' => $this->Authentication->getIdentityData('title'),
                'username' => $this->Authentication->getIdentityData('username'),
                'email' => $this->Authentication->getIdentityData('email'),
            ];
        } else {
            $statusCode = 401;
            $this->response = $this->response->withStatus($statusCode);
            $data = [
                'title' => __('Unauthorized'),
                'status' => $statusCode,
            ];
        }
        $this->set('data', $data);
        $this->viewBuilder()->setOption('serialize', 'data');
    }


    /**
     * authEdit method
     *
     * @return \Cake\Http\Response
     */
    public function authEdit()
    {
        $this->request->allowMethod('POST');

        if (!$this->request->is('ajax')) {
            throw new BadRequestException();
        }
        $result = $this->Authentication->getResult();

        $data = [];
        if ($result && $result->isValid()) {
            $req = $this->request->getData();

            $id = $this->Authentication->getIdentityData('id');

            $entity = $this->Admins->get($id);


            $entity = $this->Admins->patchEntity($entity, $req);

            if ($entity->hasErrors()) {
                $statusCode = 422;
                $this->response = $this->response->withStatus($statusCode);
                $errors = $entity->getErrors();

                $formatError = AdminUtilityComponent::flattenCustom($errors, 1);

                $data = [
                    'error' => $formatError,
                ];
            } else {
                if (!empty($req['password_new'])) {
                    $entity->password = $req['password_new'];
                }
                $this->Admins->saveOrFail($entity);

                $auth = $this->Admins->findById($id)->first();

                $this->Authentication->setIdentity($auth);

                $data = $this->_authResponseData();
            }
        } else {
            $statusCode = 401;
            $this->response = $this->response->withStatus($statusCode);
            $data = [
                'title' => __('Unauthorized'),
                'status' => $statusCode,
            ];
        }
        $this->set('data', $data);
        $this->viewBuilder()->setOption('serialize', 'data');
    }

    /**
     * authEditConfirm method
     *
     * @return \Cake\Http\Response
     */
    public function authEditConfirm()
    {
        $this->request->allowMethod('POST');

        if (!$this->request->is('ajax')) {
            throw new BadRequestException();
        }
        $result = $this->Authentication->getResult();

        $data = [];

        if ($result && $result->isValid()) {
            $req = $this->request->getData();

            $id = $this->Authentication->getIdentityData('id');

            $entity = $this->Admins->get($id);

            $entity = $this->Admins->patchEntity($entity, $req);

            if ($entity->hasErrors()) {
                $statusCode = 422;
                $this->response = $this->response->withStatus($statusCode);
                $errors = $entity->getErrors();

                $formatError = AdminUtilityComponent::flattenCustom($errors, 1);

                $data = [
                    'error' => $formatError,
                ];
            } else {
                $data = [
                    'status' => true,
                ];
            }
        } else {
            $statusCode = 401;
            $this->response = $this->response->withStatus($statusCode);
            $data = [
                'title' => __('Unauthorized'),
                'status' => $statusCode,
            ];
        }
        $this->set('data', $data);
        $this->viewBuilder()->setOption('serialize', 'data');
    }

    /**
     * authEdit method
     *
     * @return \Cake\Http\Response
     */
    public function authPasswordEdit()
    {
        $this->request->allowMethod('POST');

        if (!$this->request->is('ajax')) {
            throw new BadRequestException();
        }
        $result = $this->Authentication->getResult();

        $data = [];
        if ($result && $result->isValid()) {
            $req = $this->request->getData();

            $id = $this->Authentication->getIdentityData('id');
            $currentPassword = $this->Authentication->getIdentityData('password');

            $data = $this->Admins->get($id);


            $entity = $this->Admins->patchEntity($data, $req, ['validate' => 'changePassword']);

            $error = [];
            $hasher = new DefaultPasswordHasher();
            if (!$hasher->check($req['current_password'], $currentPassword)) {
                $error['current_password']['_eq'] = '※現在のパスワードと一致しません';
            }

            if ($entity->hasErrors() || $error) {
                $statusCode = 422;
                $this->response = $this->response->withStatus($statusCode);
                $errors = $entity->getErrors();

                $formatError = AdminUtilityComponent::flattenCustom($errors, 1);

                if (isset($error['current_password'])) {
                    $formatError['current_password'] = $error['current_password'];
                }

                $data = [
                    'error' => $formatError,
                ];
            } else {

                $data->password = $req['password_new'];

                $this->Admins->saveOrFail($entity);

                $auth = $this->Admins->findById($id)->first();

                $this->Authentication->setIdentity($auth);

                $data = $this->_authResponseData();
            }
        } else {
            $statusCode = 401;
            $this->response = $this->response->withStatus($statusCode);
            $data = [
                'title' => __('Unauthorized'),
                'status' => $statusCode,
            ];
        }
        $this->set('data', $data);
        $this->viewBuilder()->setOption('serialize', 'data');
    }
}
