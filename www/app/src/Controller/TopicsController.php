<?php

declare(strict_types=1);

namespace App\Controller;

use App\Controller\AppController;
use Cake\Core\Configure;
use Cake\Http\Exception\NotFoundException;
use Cake\ORM\Query;
use Medii\Crud\Interfaces\ConfirmInterface;
use Medii\Crud\Interfaces\CreateInterface;
use Medii\Crud\Interfaces\PreviewInterface;
use Medii\Crud\Interfaces\ReadInterface;
use Medii\Crud\Interfaces\SearchInterface;
use Medii\Crud\Interfaces\StatusInterface;
use Medii\Crud\Interfaces\UpdateInterface;

/**
 * Topics Controller
 *
 * @property \App\Model\Table\TopicsTable $Topics
 * @method \App\Model\Entity\Topic[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class TopicsController extends AppController
{
    protected $defaultTable = 'Topics';

    public $paginate = [
        'order' => [
            'Topics.created' => 'DESC',
            'Topics.modified' => 'DESC',
        ],
    ];

    /**
     * Index method
     *
     * @param \Medii\Crud\Interfaces\SearchInterface $search
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function index(SearchInterface $search)
    {
        $search->setFinder([
            ['finder' => 'publicPeriod'],
            ['finder' => 'OrderByDefault'],
        ]);

        $associated = [];
        // サムネ表示があるなら
        if (Configure::read('CustomSettings.Topics.thumbnail') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            array_push($associated, 'Files');
        }
        // カテゴリ表示があるなら
        if (Configure::read('CustomSettings.Topics.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            array_push($associated, 'MasterTopicCategories');
            $MasterTopicCategories = $this->fetchTable('MasterTopicCategories')->find()->find('public')->select(['id', 'title'])->order(['MasterTopicCategories.sequence ASC']);
            $this->set('MasterTopicCategories', $MasterTopicCategories);
        }
        $search->setfindOptions(['contain' => $associated]);

        $search->ignoreAuthorization();

        $this->paginate['limit'] = Configure::read('CustomSettings.Topics.paging') ?? 10;

        $this->set('datas', $search->search($this));
    }

    /**
     * View method
     *
     * @param \Medii\Crud\Interfaces\ReadInterface $read
     * @return \Cake\Http\Response|null|void Renders view
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function detail()
    {
        $id = $this->getRequest()->getParam('id');
        if (is_null($id)) {
            throw new NotFoundException();
        }
        $table = $this->fetchTable();
        $data = $table->find('publicPeriod')->find('slug', [
            'slug' => $id,
        ])->contain([
            'Blocks',
            'Blocks.File01' => function (Query $q) {
                return $q->find('public');
            },
            'Blocks.File02' => function (Query $q) {
                return $q->find('public');
            },
            'Metadatas',
            'Metadatas.Files' => function (Query $q) {
                return $q->find('public');
            },
        ])->firstOrFail();

        $this->set('data', $data);
    }
}
