<?php

declare(strict_types=1);

namespace App\Controller\Adsys\Api;

use App\Controller\AppController;
use App\Model\Entity\MasterTopicCategory;
use Cake\Chronos\Chronos;
use Cake\Core\Configure;
use Cake\Datasource\EntityInterface;
use Cake\Event\EventInterface;
use Cake\I18n\I18n;
use Cake\Log\Log;
use Cake\Utility\Hash;
use Medii\Crud\Interfaces\ConfirmInterface;
use Medii\Crud\Interfaces\CreateInterface;
use Medii\Crud\Interfaces\PreviewInterface;
use Medii\Crud\Interfaces\ReadInterface;
use Medii\Crud\Interfaces\SearchInterface;
use Medii\Crud\Interfaces\StatusInterface;
use Medii\Crud\Interfaces\UpdateInterface;

/**
 * MasterTopicCategories Controller
 *
 * @method \App\Model\Entity\MasterTopicCategory[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class MasterTopicCategoriesController extends AppController
{
    protected $defaultTable = 'MasterTopicCategories';

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

        if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $locale = $this->getRequest()->getQuery('locale') ?? I18n::getDefaultLocale();
            $isForeign = $locale && $locale !== I18n::getDefaultLocale();
        }

        $table = $this->fetchTable();
        $table->getEventManager()->on('Model.afterMarshal', function (EventInterface $event, EntityInterface $entity, $data, $options) {

            if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
                $now = new Chronos();

                $isForeignExists = $event->getData('options')['isForeignExists'] ?? true;
                $originalEntity = $event->getData('options')['originalEntity'] ?? [];

                if (!$isForeignExists && $originalEntity) {
                    $entity->cid = $originalEntity->cid;
                    $entity->created_by_admin = $originalEntity->created_by_admin;
                    $entity->created_by_user = $originalEntity->created_by_user;
                    $entity->public = "unpublished";
                    $entity->status = "unpublished";
                    $entity->created = $now->format('Y-m-d H:i:s');
                    $entity->modified = $now->format('Y-m-d H:i:s');
                }
            }
        });

        if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $update->ignoreAddDefaultLocaleData();
        }


        $this->set('data', $update->save($this));

        if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            I18n::setLocale($locale);
            // 公開テーブルと別れている場合のみ必要
            $ids = $table->find('list', [
                'keyField' => 'id',
                'valueField' => 'id'
            ])->where(['status' => 'published'] + ($isForeign ? ['locale' => $locale] : []))->all()->toArray();


            if ($ids) {
                $table->setStatus(['ids' => array_values($ids), 'status' => "published"], $this->Authentication->getIdentityData('role'), ['currentLocale' => $locale]);
            }
        } else {
            $ids = $table->find('list', [
                'keyField' => 'id',
                'valueField' => 'id'
            ])->where(['status' => 'published'])->all()->toArray();


            if ($ids) {
                $table->setStatus(['ids' => array_values($ids), 'status' => "published"], $this->Authentication->getIdentityData('role'));
            }
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
