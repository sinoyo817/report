<?php
declare(strict_types=1);

namespace App\Controller\Adsys\Api;

use App\Controller\AppController;
use App\Model\Entity\DayWork;
use App\Model\Filter\DayWorksCollection;
use Medii\Crud\Interfaces\ConfirmInterface;
use Medii\Crud\Interfaces\CreateInterface;
use Medii\Crud\Interfaces\PreviewInterface;
use Medii\Crud\Interfaces\ReadInterface;
use Medii\Crud\Interfaces\SearchInterface;
use Medii\Crud\Interfaces\StatusInterface;
use Medii\Crud\Interfaces\UpdateInterface;

use Cake\ORM\Query;
use Cake\Core\Configure;
use Cake\Log\Log;
use Cake\Utility\Hash;
use Cake\Mailer\MailerAwareTrait;
use Cake\Http\CallbackStream;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Csv as WriterCsv;

/**
 * DayWorks Controller
 *
 * @method \App\Model\Entity\DayWork[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class DayWorksController extends AppController
{
    use MailerAwareTrait;
    protected $defaultTable = 'DayWorks';

    public $paginate = [
        'limit' => 20,
        'order' => [
            'DayWorks.created' => 'DESC',
            'DayWorks.modified' => 'DESC',
        ],
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
        $associated = ['Blocks', 'Metadatas', 'CreateAdmins', 'ModifiedAdmins'];
        $conditions = [];

        // ログインしているユーザーのIDを取得
        $result = $this->Authentication->getResult();
        if ($result->isValid()) {
            $identity = $this->request->getAttribute('identity');
            $superuser = $identity->get('superuser');

            // スーパーユーザーじゃなければ自分が登録したものだけ
            if (!$superuser) {
                $userId = $identity->getIdentifier();
                $conditions = ['DayWorks.created_by_admin' => $userId];
            }
        }

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
        $associated = ['Blocks', 'Metadatas'];
        $create->setPatchEntityOptions([
            'associated' => $associated
        ]);

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
        $commonAssociated = ['Blocks', 'Metadatas'];
        $findAssociated = $commonAssociated;
        $patchAssociated = $commonAssociated;

        $update->setfindOptions(['contain' => $findAssociated]);
        $update->setPatchEntityOptions([
            'associated' => $patchAssociated,
            'validate' => 'default',
        ]);
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
        $commonAssociated = ['Blocks', 'Metadatas'];
        $findAssociated = $commonAssociated;
        $patchAssociated = $commonAssociated;

        $confirm->setfindOptions(['contain' => $findAssociated]);
        $confirm->setPatchEntityOptions([
            'associated' => $patchAssociated,
            'validate' => 'default',
        ]);
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
        $associated = ['Blocks', 'Metadatas'];
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
        $associated = ['Blocks', 'Metadatas'];
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

        // 必要なマスタデータ等を追加していく

        // ログインしているユーザーのIDを取得
        $conditions = [];
        $result = $this->Authentication->getResult();
        if ($result->isValid()) {
            $identity = $this->request->getAttribute('identity');
            $superuser = $identity->get('superuser');
            // スーパーユーザーじゃなければ自分が登録したものだけ
            if (!$superuser) {
                $userId = [Configure::read('Master.SuperUserId')];
                $userId[] = $identity->getIdentifier();
                $conditions = ['MasterProductCodes.created_by_admin IN ' => $userId];
            }
        }

        $table = $this->fetchTable('MasterProductCodes');
        $ProductCodes = $table->find()->find('public')->select(['id', 'title'])->where($conditions);

        $table = $this->fetchTable('MasterWorkCodes');
        $WorkCodes = $table->find()->find('public')->select(['id', 'title']);

        $data = [
            'master_product_codes' => $ProductCodes,
            'master_work_codes' => $WorkCodes,
        ];

         $this->set('data', $data);
    }

    public function report()
    {
        $id = $this->request->getQueryParams()['id'];

        $associated = [
            'Blocks' => function (Query $q) {
                return $q->where(['value05' => '1'])->distinct('value01');
            },
            'CreateAdmins'
        ];

        $table = $this->fetchTable();
        
        if($id && $table->exists(["DayWorks.id" => $id])) {
            $data = $table->findById($id)->contain($associated)->firstOrFail();

            $table = $this->fetchTable('MasterProductCodes');
            $ProductCodes = $table->find('list')->select(['id', 'title'])->toArray();

            $this->getMailer('Report')->send('sendReport', [$data, $ProductCodes]);
        }

        return $this->redirect(['controller' => 'DayWorks' , 'action' => 'index', 'prefix' => 'Adsys']);
    }
}
