<?php

declare(strict_types=1);

namespace App\Model\Table;

use ArrayObject;
use Cake\Chronos\Chronos;
use Cake\Core\Configure;
use Cake\Event\EventInterface;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Events Model
 *
 * @property \App\Model\Table\FilesTable&\Cake\ORM\Association\BelongsTo $Files
 * @property \App\Model\Table\MasterEventCategoriesEventsPrivateTable&\Cake\ORM\Association\HasMany $MasterEventCategoriesEventsPrivate
 * @property \App\Model\Table\MasterEventCategoriesTable&\Cake\ORM\Association\BelongsToMany $MasterEventCategories
 *
 * @method \App\Model\Entity\Event newEmptyEntity()
 * @method \App\Model\Entity\Event newEntity(array $data, array $options = [])
 * @method \App\Model\Entity\Event[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\Event get($primaryKey, $options = [])
 * @method \App\Model\Entity\Event findOrCreate($search, ?callable $callback = null, $options = [])
 * @method \App\Model\Entity\Event patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\Event[] patchEntities(iterable $entities, array $data, array $options = [])
 * @method \App\Model\Entity\Event|false save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Event saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Event[]|\Cake\Datasource\ResultSetInterface|false saveMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\Event[]|\Cake\Datasource\ResultSetInterface saveManyOrFail(iterable $entities, $options = [])
 * @method \App\Model\Entity\Event[]|\Cake\Datasource\ResultSetInterface|false deleteMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\Event[]|\Cake\Datasource\ResultSetInterface deleteManyOrFail(iterable $entities, $options = [])
 *
 * @mixin \Medii\TextSerialize\Model\Behavior\TextSerializeBehavior
 * @mixin \App\Model\Behavior\CommonAssociationBehavior
 * @mixin \Medii\File\Model\Behavior\FileBehavior
 * @mixin \Medii\Approval\Model\Behavior\ApprovalBehavior
 */
class EventsTable extends AppTable
{
    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config): void
    {
        parent::initialize($config);

        $this->setTable('events');
        $this->setDisplayField('title');
        $this->setPrimaryKey('id');

        // メタデータ
        $this->addBehavior('CommonAssociation', [
            'isAssociation' => [
                'blocks' => false,
                'metadatas' => true,
            ],
        ]);

        // アクセスランキング
        // 削除用
        $this->hasMany('AccessRankings')
            ->setClassName('Medii/Recommend.AccessRankings')
            ->setForeignKey('foreign_id')
            ->setDependent(true)
            ->setCascadeCallbacks(true)
            ->setConditions(['AccessRankings.model' => $this->_alias]);
        // 3ヶ月分アクセス数

        $monthAgo = (new Chronos())->startOfMonth()->subMonths(3)->format('Y-m-d');
        $this->hasOne('SomeMonthAccessRankings')
            ->setClassName('Medii/Recommend.AccessRankings')
            ->setForeignKey('foreign_id')
            ->setConditions(['SomeMonthAccessRankings.model' => $this->_alias, "SomeMonthAccessRankings.date >= " => $monthAgo]);

        // ファイルフィールド管理と公開/非公開テーブル管理
        $fileFields = [];
        $approvalTables = [
            $this,
            $this->Metadatas,
        ];

        // 作成管理者
        $this->belongsTo('CreateAdmins')
            ->setClassName('Admins')
            ->setForeignKey('created_by_admin');

        // 更新管理者
        $this->belongsTo('ModifiedAdmins')
            ->setClassName('Admins')
            ->setForeignKey('modified_by_admin');

        // 承認機能
        if (Configure::read('CustomSettings.Events.approve') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {

            // 作成ユーザ
            $this->belongsTo('CreateUsers')
                ->setClassName('Admins')
                ->setForeignKey('created_by_user');

            // 更新ユーザ
            $this->belongsTo('ModifiedUsers')
                ->setClassName('Admins')
                ->setForeignKey('created_by_user');

            // 差し戻し
            $this->hasMany('ApprovalRemands')
                ->setForeignKey('foreign_id')
                ->setDependent(true)
                ->setConditions(['ApprovalRemands.model' => $this->_alias])
                ->setSort(['ApprovalRemands.created' => 'desc']);

            $approvalTables[] = $this->ApprovalRemands;
        }

        // メイン画像
        $this->belongsTo('Files')
            ->setForeignKey('file_id')
            ->setClassName('Medii/File.Files')
            ->setDependent(false);

        $fileFields[] = 'file_id';

        // サブ画像
        $this->hasMany("EventImages")
            ->setClassName('Medii/Block.Blocks')
            ->setForeignKey('foreign_id')
            ->setDependent(true)
            ->setCascadeCallbacks(true)
            ->setSaveStrategy('replace')
            ->setConditions(['EventImages.model' => $this->_alias, 'EventImages.type' => 'image'])
            ->setSort(['sequence' => 'asc']);

        $approvalTables[] = $this->EventImages;

        $fileFields['associated']['event_images']['fields'] = ['file01_id'];

        $EventImagesTable = $this->getAssociation('EventImages')->getTarget();

        // BlockBehavior追加
        $EventImagesTable->addBehavior('CustomBlock');

        $EventImagesTable->belongsTo('File01')
            ->setClassName('Medii/File.Files')
            ->setForeignKey('file01_id')
            ->setConditions(['File01.model' => $this->_alias])
            ->setDependent(false);

        // 関連リンク
        $this->hasMany("EventLinks")
            ->setClassName('Medii/Block.Blocks')
            ->setForeignKey('foreign_id')
            ->setDependent(true)
            ->setCascadeCallbacks(true)
            ->setSaveStrategy('replace')
            ->setConditions(['EventLinks.model' => $this->_alias, 'EventLinks.type' => 'link'])
            ->setSort(['sequence' => 'asc']);

        $approvalTables[] = $this->EventLinks;

        $EventLinksTable = $this->getAssociation('EventLinks')->getTarget();

        $EventLinksTable->addBehavior('CustomBlock');

        // 関連ファイル
        $this->hasMany("EventFiles")
            ->setClassName('Medii/Block.Blocks')
            ->setForeignKey('foreign_id')
            ->setDependent(true)
            ->setCascadeCallbacks(true)
            ->setSaveStrategy('replace')
            ->setConditions(['EventFiles.model' => $this->_alias, 'EventFiles.type' => 'file'])
            ->setSort(['sequence' => 'asc']);

        $approvalTables[] = $this->EventFiles;

        $fileFields['associated']['event_files']['fields'] = ['file01_id'];

        $EventFilesTable = $this->getAssociation('EventFiles')->getTarget();

        $EventFilesTable->addBehavior('CustomBlock');

        $EventFilesTable->belongsTo('File01')
            ->setClassName('Medii/File.Files')
            ->setForeignKey('file01_id')
            ->setConditions(['File01.model' => $this->_alias])
            ->setDependent(false);

        // 開催日(飛び日)
        $this->hasMany("EventDates")
            ->setForeignKey('event_id')
            ->setDependent(true)
            ->setCascadeCallbacks(true)
            ->setSaveStrategy('replace')
            ->setSort(['date' => 'asc']);

        $approvalTables[] = $this->EventDates;

        // エリア(単一)
        if (Configure::read('CustomSettings.Events.area') === Configure::read('Site.Settings.CategoryUseTypeKey.singleKey')) {

            $this->belongsTo('MasterAreas')
                ->setForeignKey('master_area_id');
            // 複数
        } else if (Configure::read('CustomSettings.Events.area') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey')) {

            $this->belongsToMany('MasterAreas', [
                'joinTable' => 'master_areas_events',
            ])
                ->setForeignKey('event_id')
                ->setTargetForeignKey('master_area_id')
                ->setCascadeCallbacks(true)
                ->setDependent(true);

            $this->hasMany('MasterAreasEvents')
                ->setForeignKey('event_id')
                ->setDependent(true)
                ->setSaveStrategy('replace');

            $approvalTables[] = $this->MasterAreasEvents;
        }


        // カテゴリ表示(単一)
        if (Configure::read('CustomSettings.Events.category') === Configure::read('Site.Settings.CategoryUseTypeKey.singleKey')) {

            $this->belongsTo('MasterEventCategories')
                ->setForeignKey('master_event_category_id');
        } else if (Configure::read('CustomSettings.Events.category') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey')) {

            $this->belongsToMany('MasterEventCategories', [
                'joinTable' => 'master_event_categories_events',
            ])
                ->setForeignKey('event_id')
                ->setTargetForeignKey('master_event_category_id')
                ->setCascadeCallbacks(true)
                ->setDependent(true);

            $this->hasMany('MasterEventCategoriesEvents')
                ->setForeignKey('event_id')
                ->setDependent(true)
                ->setSaveStrategy('replace');

            $approvalTables[] = $this->MasterEventCategoriesEvents;
        }

        $this->addBehavior('Medii/TextSerialize.TextSerialize');

        $this->addBehavior('Medii/File.File', [
            'fileIdFields' => [
                'fields' => $fileFields,
            ],
            'commonAssociation' => [
                'blocks' => false,
                'metadata' => true,
            ],
        ]);
        $this->addBehavior('Medii/Approval.Approval', [
            'approvalTables' => $approvalTables,
        ]);
    }

    public function beforeMarshal(EventInterface $event, ArrayObject $data, ArrayObject $options)
    {
        if (isset($data['event_dates_values']) && $data['event_dates_values']) {

            $dates = explode(',', $data['event_dates_values']);
            if ($dates) {
                $eventDates = [];
                foreach ($dates as $date) {
                    $eventDates[] = [
                        'date' => $date
                    ];
                }
                $data['event_dates'] = $eventDates;
            }
        }
    }

    /**
     * Default validation rules.
     *
     * @param \Cake\Validation\Validator $validator Validator instance.
     * @return \Cake\Validation\Validator
     */
    public function validationDefault(Validator $validator): Validator
    {

        $validator
            ->scalar('area')
            ->maxLength('area', 50)
            ->allowEmptyString('area');

        $validator
            ->scalar('title')
            ->maxLength('title', 255)
            ->notEmptyString('title');

        $validator
            ->scalar('url')
            ->maxLength('url', 512)
            ->allowEmptyString('url');

        $validator
            ->scalar('url_is_blank')
            ->maxLength('url_is_blank', 1)
            ->allowEmptyString('url_is_blank');

        $validator
            ->allowEmptyString('file_id');

        $validator
            ->scalar('file_alt')
            ->maxLength('file_alt', 255)
            ->allowEmptyFile('file_alt');

        $validator
            ->scalar('summary')
            ->allowEmptyString('summary');

        $validator
            ->scalar('summary_files')
            ->maxLength('summary_files', 4294967295)
            ->allowEmptyString('summary_files');

        $validator
            ->date('published')
            ->allowEmptyDate('published');

        $validator
            ->date('start_date')
            ->allowEmptyDate('start_date');

        $validator
            ->date('end_date')
            ->allowEmptyDate('end_date');

        return $validator;
    }

    /**
     * findOrderByAccess method
     *
     * アクセス順
     *
     * @param \Cake\ORM\Query $query
     * @param array $options
     * @return void
     */
    public function findOrderByAccess(Query $query, array $options)
    {
        return $query->order([
            "SomeMonthAccessRankings.count" => 'DESC',
        ]);
    }

    /**
     * findPaging method
     *
     * 開催中近い順 => 開催前 => 開催終了
     *
     * @param \Cake\ORM\Query $query
     * @param array $options
     * @return void
     */
    public function findEventPaging(Query $query, array $options)
    {

        $now = new Chronos();
        $nowEvent = $query->newExpr()->case()
            ->when([
                "{$this->_alias}.event_start_date" . ' <= ' => $now->format('Y-m-d'),
                "{$this->_alias}.event_end_date" . ' >= ' => $now->format('Y-m-d'),
            ])
            ->then(2)
            ->when([
                "{$this->_alias}.event_start_date" . ' > ' => $now->format('Y-m-d'),
            ])
            ->then(1)
            ->when([
                "{$this->_alias}.event_end_date" . ' < ' => $now->format('Y-m-d'),
            ])
            ->then(0);
        $diff = $query->func()->abs([$query->func()->dateDiff([
            'NOW()' => 'literal',
            "{$this->_alias}.event_start_date" => 'identifier'
        ])]);

        $query->select($this);
        $query->select($this->Files);
        $query->select(['event_start_diff' => $diff]);
        $query->select(['now_event' => $nowEvent]);
        $query->order(['now_event' => 'desc', 'event_start_diff' => 'asc',]);

        return $query;
    }

    /**
     * findPeripheral method
     *
     * @param \Cake\ORM\Query $query
     * @param array $options
     * @return void
     */
    public function findPeripheral(Query $query, array $options)
    {
        /** @var AbstractLocalizeTable $this */

        if (empty($options['lttd']) || empty($options['lgtd'])) {
            return $query->find('empty');
        }

        $query
            ->where([
                'not' => [
                    $this->aliasField('lttd') . ' IS NULL',
                    $this->aliasField('lgtd') . ' IS NULL',
                    $this->aliasField('lttd') => 0,
                    $this->aliasField('lgtd') => 0,
                ]
            ]);

        //geomerty型の代わりに距離をkmで出す式
        //        $distanceExpr = '6371 * acos(cos(radians(:lttd)) * cos(radians(lttd)) * cos(radians(lgtd) - radians(:lgtd)) + sin(radians(:lttd)) * sin(radians(lttd)))';

        $distanceExpr = $query->newExpr()
            ->setConjunction('*')
            ->add('6371')
            ->add($query->func()->acos(
                [
                    $query->newExpr()
                        ->setConjunction('+')
                        ->add(
                            $query->newExpr()
                                ->setConjunction('*')
                                ->add(
                                    $query->func()->cos(
                                        [
                                            $query->func()->radians([':lttd' => 'identifier'])
                                        ]
                                    )
                                )
                                ->add(
                                    $query->func()->cos(
                                        [
                                            $query->func()->radians([$query->identifier($this->aliasField('lttd'))])
                                        ]
                                    )
                                )
                                ->add(
                                    $query->func()->cos([
                                        $query
                                            ->newExpr()
                                            ->setConjunction('-')
                                            ->add($query->func()->radians([$query->identifier($this->aliasField('lgtd'))]))
                                            ->add($query->func()->radians([':lgtd' => 'identifier']))
                                    ])
                                )
                        )
                        ->add(
                            $query->newExpr()
                                ->setConjunction('*')
                                ->add(
                                    $query->func()->sin(
                                        [
                                            $query->func()->radians([':lttd' => 'identifier'])
                                        ]
                                    )
                                )
                                ->add(
                                    $query->func()->sin(
                                        [
                                            $query->func()->radians([$query->identifier($this->aliasField('lttd'))])
                                        ]
                                    )
                                )
                        )
                ]
            ));

        $query->select($this);

        $query->select([
            'distance' => $distanceExpr
        ]);

        if (isset($options['scale'])) {
            $query->where([
                $query->newExpr()
                    ->lte($distanceExpr, ($options['scale'] / 1000))
            ]);
        }

        $query->distinct([$this->aliasField($this->getPrimaryKey())]);

        //経緯度
        $lttd = (float)$options['lttd'];
        $lgtd = (float)$options['lgtd'];

        $query
            ->order(['distance ASC']);

        if (isset($options['limit']) || empty($options['scale'])) {
            $query->limit(isset($options['limit']) ? $options['limit'] : 10);
        }

        return $query->bind(':lttd', $lttd, 'float')
            ->bind(':lgtd', $lgtd, 'float');
    }
}
