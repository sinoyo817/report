<?php

declare(strict_types=1);

namespace App\Model\Table;

use ArrayObject;
use Cake\Core\Configure;
use Cake\Event\EventInterface;
use Cake\ORM\Query;
use Cake\Validation\Validator;

/**
 * Topics Model
 *
 * @method \App\Model\Entity\Topic newEmptyEntity()
 * @method \App\Model\Entity\Topic newEntity(array $data, array $options = [])
 * @method \App\Model\Entity\Topic[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\Topic get($primaryKey, $options = [])
 * @method \App\Model\Entity\Topic findOrCreate($search, ?callable $callback = null, $options = [])
 * @method \App\Model\Entity\Topic patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\Topic[] patchEntities(iterable $entities, array $data, array $options = [])
 * @method \App\Model\Entity\Topic|false save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Topic saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Topic[]|\Cake\Datasource\ResultSetInterface|false saveMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\Topic[]|\Cake\Datasource\ResultSetInterface saveManyOrFail(iterable $entities, $options = [])
 * @method \App\Model\Entity\Topic[]|\Cake\Datasource\ResultSetInterface|false deleteMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\Topic[]|\Cake\Datasource\ResultSetInterface deleteManyOrFail(iterable $entities, $options = [])
 *
 * @mixin \Medii\TextSerialize\Model\Behavior\TextSerializeBehavior
 * @mixin \App\Model\Behavior\CommonAssociationBehavior
 * @mixin \Medii\Approval\Model\Behavior\ApprovalBehavior
 * @mixin \Medii\File\Model\Behavior\FileBehavior
 */
class TopicsTable extends AppTable
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

        $this->setTable('topics');
        $this->setDisplayField('title');
        $this->setPrimaryKey('id');

        $this->addBehavior('Medii/TextSerialize.TextSerialize');
        $this->addBehavior('CommonAssociation', [
            'isAssociation' => [
                'blocks' => true,
                'metadatas' => true,
            ],
        ]);

        if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $this->addBehavior('Translate', [
                'allowEmptyTranslations' => true,
                'strategyClass' => \Cake\ORM\Behavior\Translate\ShadowTableStrategy::class,
            ]);
        }

        $fileFields = [];
        $approvalTables = [
            $this,
            $this->Blocks,
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
        if (Configure::read('CustomSettings.Topics.approve') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {

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

        // サムネイル表示
        if (Configure::read('CustomSettings.Topics.thumbnail') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $this->belongsTo('Files')
                ->setForeignKey('file_id')
                ->setClassName('Medii/File.Files')
                ->setDependent(false);

            $fileFields[] = 'file_id';
        }

        // 概要文表示
        if (Configure::read('CustomSettings.Topics.summary') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $fileFields[] = 'summary_files';
        }

        // カテゴリ表示(単一)
        if (Configure::read('CustomSettings.Topics.category') === Configure::read('Site.Settings.CategoryUseTypeKey.singleKey')) {

            $this->belongsTo('MasterTopicCategories')
                ->setForeignKey('master_topic_category_id');

            // (複数)
        } elseif (Configure::read('CustomSettings.Topics.category') === Configure::read('Site.Settings.CategoryUseTypeKey.multiKey')) {

            $this->belongsToMany('MasterTopicCategories', [
                'joinTable' => 'master_topic_categories_topics',
            ])
                ->setForeignKey('topic_id')
                ->setTargetForeignKey('master_topic_category_id')
                ->setCascadeCallbacks(true)
                ->setDependent(true);

            $this->hasMany('MasterTopicCategoriesTopics')
                ->setForeignKey('topic_id')
                ->setDependent(true)
                ->setSaveStrategy('replace');

            $approvalTables[] = $this->MasterTopicCategoriesTopics;
        }


        $this->addBehavior('Medii/File.File', [
            'fileIdFields' => [
                'fields' => $fileFields,
            ],
            'commonAssociation' => [
                'blocks' => true,
                'metadata' => true,
            ],
        ]);


        $this->addBehavior('Medii/Approval.Approval', [
            'approvalTables' =>  $approvalTables,
        ]);
    }

    public function beforeMarshal(EventInterface $event, ArrayObject $data, ArrayObject $options)
    {
        if (isset($data['slug']) && $data['slug']) {
            $data['slug'] = preg_replace('/\s|　/', '', $data['slug']);
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
        $validator = $this->validationCommon($validator);

        $validator
            ->allowEmptyString('slug')
            ->add('slug', [
                'format' => [
                    'rule' => ['custom', "/^[a-zA-Z0-9_\-]*$/u"],
                    'message' => '※半角英数字で入力してください',
                    'last' => true,
                ],
            ])->add('slug', 'unique', [
                'rule' => 'validateUnique',
                'provider' => 'table',
                'message' => '※すでに同じページURLが登録されています'
            ]);

        return $validator;
    }

    /**
     * Default validation rules.
     *
     * @param \Cake\Validation\Validator $validator Validator instance.
     * @return \Cake\Validation\Validator
     */
    public function validationLocale(Validator $validator): Validator
    {
        $validator = $this->validationCommon($validator);

        return $validator;
    }

    /**
     * common validation rules.
     *
     * @param \Cake\Validation\Validator $validator Validator instance.
     * @return \Cake\Validation\Validator
     */
    public function validationCommon(Validator $validator): Validator
    {
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
            ->scalar('summary')
            ->allowEmptyString('summary');

        $validator
            ->scalar('summary_files')
            ->maxLength('summary_files', 4294967295)
            ->allowEmptyFile('summary_files');

        $validator
            ->date('start_date')
            ->allowEmptyDate('start_date');

        $validator
            ->date('end_date')
            ->allowEmptyDate('end_date');

        return $validator;
    }


    /**
     * findCreatedByUser method
     *
     * @param \Cake\ORM\Query $query
     * @param array $options
     * @return void
     */
    public function findSlug(Query $query, array $options)
    {
        $slug = $options['slug'];
        return $query->where([
            'OR' => [
                "{$this->_alias}.slug" => $slug,
                "{$this->_alias}.id" => $slug,
            ]
        ]);
    }
}
