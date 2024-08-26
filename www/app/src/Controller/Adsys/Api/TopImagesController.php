<?php
declare(strict_types=1);

namespace App\Controller\Adsys\Api;

use App\Controller\AppController;

use App\Model\Entity\TopImage;
use App\Model\Filter\TopImagesCollection;
use ArrayObject;
use Cake\Collection\Collection;

use Medii\Crud\Interfaces\ConfirmInterface;
use Medii\Crud\Interfaces\CreateInterface;
use Medii\Crud\Interfaces\PreviewInterface;
use Medii\Crud\Interfaces\ReadInterface;
use Medii\Crud\Interfaces\SearchInterface;
use Medii\Crud\Interfaces\StatusInterface;
use Medii\Crud\Interfaces\UpdateInterface;

// use App\Model\Entity\TopImage;
// use App\Model\Filter\TopImagesCollection;
// use Cake\Http\CallbackStream;

use Cake\Datasource\EntityInterface;
use Cake\Event\EventInterface;
use Cake\I18n\I18n;
use Cake\Core\Configure;
use Cake\Chronos\Chronos;

/**
 * TopImages Controller
 *
 * @method \App\Model\Entity\TopImage[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class TopImagesController extends AppController
{
    protected $defaultTable = 'TopImages';

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
        $associated = [];
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
        if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $locale = $this->getRequest()->getQuery('locale') ?? I18n::getDefaultLocale();
            $isForeign = $locale && $locale !== I18n::getDefaultLocale();
        }
        
        $commonAssociated = [];
        $findAssociated = $commonAssociated;
        $patchAssociated = $commonAssociated;

        $update->setfindOptions(['contain' => $findAssociated]);

        if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $update->setPatchEntityOptions([
                'associated' => $patchAssociated,
                'validate' => $isForeign ? 'locale' : 'default',
            ]);
        } else {
            $update->setPatchEntityOptions([
                'associated' => $patchAssociated,
                'validate' => 'default',
            ]);
        }

        $table = $this->fetchTable();
        $table->getEventManager()->on('Model.afterMarshal', function (EventInterface $event, EntityInterface $entity, $data, $options) {
           
            if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
                $isForeignExists = $event->getData('options')['isForeignExists'] ?? true;
                $originalEntity = $event->getData('options')['originalEntity'] ?? [];

                // created_by_adminが無いとPolicyに引っかかるため追加
                if (!$isForeignExists && $originalEntity) {
                    $now = new Chronos();
                    $entity->created_by_admin = $originalEntity->created_by_admin;
                    $entity->created_by_user = $originalEntity->created_by_user;
                    $entity->public = "unpublished";
                    $entity->created = $now->format('Y-m-d H:i:s');
                    $entity->modified = $now->format('Y-m-d H:i:s');
                }
            }
        });

        // TranslateBehaviorのbeforeSaveより先に実行させる
        $table->getEventManager()->on('Model.beforeSave', ['priority' => 3], function (EventInterface $event, EntityInterface $entity) use ($user) {
            if ($entity instanceof TopImage) {
                $entity->status = 'draft';
                $now = new Chronos();
                if ($user->role === 'Admin') {
                    $entity->modified_admin = $now->format('Y-m-d H:i:s');
                } else {
                    $entity->modified_user = $now->format('Y-m-d H:i:s');
                }
            }
        });

        // $update->ignoreAddDefaultLocaleData();

        if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $update->ignoreAddDefaultLocaleData();
        }

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
        if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $locale = $this->getRequest()->getQuery('locale');
            $isForeign = $locale && $locale !== I18n::getDefaultLocale();
        }
        
        $commonAssociated = [];
        $findAssociated = $commonAssociated;
        $patchAssociated = $commonAssociated;

        $confirm->setfindOptions(['contain' => $findAssociated]);
        if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $confirm->setPatchEntityOptions([
                'associated' => $patchAssociated,
                'validate' => $isForeign ? 'locale' : 'default',
            ]);

            $confirm->ignoreAddDefaultLocaleData();
        } else {
            $confirm->setPatchEntityOptions([
                'associated' => $patchAssociated,
                'validate' => 'default',
            ]);
        }

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
        $associated = [];
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
        $associated = [];
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