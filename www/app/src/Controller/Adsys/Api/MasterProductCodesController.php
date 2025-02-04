<?php
declare(strict_types=1);

namespace App\Controller\Adsys\Api;

use App\Controller\AppController;
use App\Model\Entity\MasterProductCode;
use Cake\ORM\Query;
use ArrayObject;
use Cake\Chronos\Chronos;
use Cake\Core\Configure;
use Cake\Datasource\EntityInterface;
use Cake\Event\EventInterface;
use Cake\Log\Log;
use Medii\Crud\Interfaces\ConfirmInterface;
use Medii\Crud\Interfaces\CreateInterface;
use Medii\Crud\Interfaces\PreviewInterface;
use Medii\Crud\Interfaces\ReadInterface;
use Medii\Crud\Interfaces\SearchInterface;
use Medii\Crud\Interfaces\StatusInterface;
use Medii\Crud\Interfaces\UpdateInterface;

/**
 * MasterProductCodes Controller
 *
 * @method \App\Model\Entity\MasterProductCode[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class MasterProductCodesController extends AppController
{
    protected $defaultTable = 'MasterProductCodes';

    public $paginate = [
        'limit' => 20,
    ];

    public function initialize(): void
    {
        parent::initialize();

        // Authenticationコンポーネントをロード
        $this->loadComponent('Authentication.Authentication');
    }

    /**
     * Index method
     *
     * @param \Medii\Crud\Interfaces\SearchInterface $search
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function index(SearchInterface $search)
    {
        $associated = ['CreateAdmins', 'ModifiedAdmins'];
        $conditions = [];

        // ログインしているユーザーのIDを取得
        $result = $this->Authentication->getResult();
        if ($result->isValid()) {
            $identity = $this->request->getAttribute('identity');
            $superuser = $identity->get('superuser');

            // スーパーユーザーじゃなければスーパーユーザーが登録したものと自分が登録したものだけ
            if (!$superuser) {
                $userId = [Configure::read('Master.SuperUserId')];
                $userId[] = $identity->getIdentifier();
                $conditions = ['MasterProductCodes.created_by_admin IN ' => $userId];
            }
        }

        // $search->setfindOptions(['contain' => $associated]);
        $search->setfindOptions([
            'contain' => $associated,
            'conditions' => $conditions
        ]);
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

        // 普通に登録すると新規記事が一番後ろに来るので並び替える
        $table = $this->fetchTable();
        $table->getEventManager()->on('Model.afterSave', ['priority' => 3], function (EventInterface $event, EntityInterface $entity) use ($table) {
            $this->MasterProductCodes->changeSequence($entity);
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
        // $commonAssociated = [];
        // $findAssociated = $commonAssociated;
        // $patchAssociated = $commonAssociated;

        // $update->setfindOptions(['contain' => $findAssociated]);
        // $update->setPatchEntityOptions([
        //     'associated' => $patchAssociated,
        //     'validate' => 'default',
        // ]);
        $this->set('data', $update->save($this));

        // 公開テーブルと別れている場合のみ必要
        $table = $this->fetchTable();
        $ids = $table->find('list', [
            'keyField' => 'id',
            'valueField' => 'id'
        ])->where(['status' => 'published'])->all()->toArray();

        if ($ids) {
            $table->setStatus(['ids' => array_values($ids), 'status' => "published"], $this->Authentication->getIdentityData('role'),);
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
        // $commonAssociated = [];
        // $findAssociated = $commonAssociated;
        // $patchAssociated = $commonAssociated;

        // $confirm->setfindOptions(['contain' => $findAssociated]);
        // $confirm->setPatchEntityOptions([
        //     'associated' => $patchAssociated,
        //     'validate' => 'default',
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

        $this->set('data', $data);
    }
}
