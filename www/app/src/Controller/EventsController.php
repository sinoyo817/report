<?php

declare(strict_types=1);

namespace App\Controller;

use Cake\Core\Configure;
use Cake\Event\EventInterface;
use Cake\ORM\Query;
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

    public $paginate = [];

    public function beforeFilter(EventInterface $event)
    {
        if (Configure::read('CustomSettings.Events.area') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $masterAreasTable = $this->fetchTable('MasterAreas');
            $masterAreas = $masterAreasTable->find("public")->order("sequence ASC")->toArray();

            $this->set(compact('masterAreas'));
        }

        if (Configure::read('CustomSettings.Events.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $masterEventCategoriesTable = $this->fetchTable('MasterEventCategories');
            $masterEventCategories = $masterEventCategoriesTable->find("public")->order("sequence ASC")->toArray();
            $this->set(compact('masterEventCategories'));
        }
    }

    /**
     * Index method
     *
     * @param \Medii\Crud\Interfaces\SearchInterface $search
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function index(SearchInterface $search)
    {
        $associated = [
            'EventDates',
            'Files' => function (Query $q) {
                return $q->find('public');
            },
            'SomeMonthAccessRankings',
        ];
        if (Configure::read('CustomSettings.Events.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated[] = 'MasterEventCategories';
        }
        if (Configure::read('CustomSettings.Events.area') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated[] = 'MasterAreas';
        }
        $search->setfindOptions(['contain' => $associated]);
        $search->setFinder([
            ['finder' => 'publicPeriod'],
            ['finder' => 'orderByAccess'],
        ]);
        $search->ignoreAuthorization();

        $this->paginate['limit'] = Configure::read('CustomSettings.Events.paging') ?? 10;

        $this->set('datas', $search->search($this));
    }

    /**
     * modified method
     *
     * @param \Medii\Crud\Interfaces\SearchInterface $search
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function modified(SearchInterface $search)
    {
        $associated = [
            'EventDates',
            'Files' => function (Query $q) {
                return $q->find('public');
            },
        ];
        if (Configure::read('CustomSettings.Events.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated[] = 'MasterEventCategories';
        }
        if (Configure::read('CustomSettings.Events.area') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated[] = 'MasterAreas';
        }
        $search->setfindOptions(['contain' => $associated]);
        $search->setFinder([
            ['finder' => 'publicPeriod'],
            ['finder' => 'orderByModified'],
        ]);
        $search->ignoreAuthorization();

        $this->paginate['limit'] = Configure::read('CustomSettings.Events.paging') ?? 10;

        $this->set('datas', $search->search($this));

        $this->render('index');
    }

    /**
     * Detail method
     *
     * @param \Medii\Crud\Interfaces\ReadInterface $read
     * @return \Cake\Http\Response|null|void Renders view
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function detail(ReadInterface $read)
    {
        $associated = [
            'EventImages',
            'EventImages.File01' => function (Query $q) {
                return $q->find('public');
            },
            'EventLinks',
            'EventFiles',
            'EventFiles.File01' => function (Query $q) {
                return $q->find('public');
            },
            'Metadatas',
            'Metadatas.Files' => function (Query $q) {
                return $q->find('public');
            },
            'EventDates',
            'Files' => function (Query $q) {
                return $q->find('public');
            },
        ];
        if (Configure::read('CustomSettings.Events.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated[] = 'MasterEventCategories';
        }
        if (Configure::read('CustomSettings.Events.area') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated[] = 'MasterAreas';
        }
        $read->setfindOptions(['finder' => 'publicPeriod', 'contain' => $associated]);

        $read->ignoreAuthorization();
        $this->set('data', $read->read($this));
    }
}
