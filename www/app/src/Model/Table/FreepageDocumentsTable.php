<?php

declare(strict_types=1);

namespace App\Model\Table;

use ArrayObject;
use Cake\Core\Configure;
use Cake\Datasource\EntityInterface;
use Cake\Event\EventInterface;
use Cake\Log\Log;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\ORM\TableRegistry;
use Cake\Validation\Validator;

/**
 * FreepageDocuments Model
 *
 * @property \App\Model\Table\FilesTable&\Cake\ORM\Association\BelongsTo $Files
 * @property \App\Model\Table\FreepageDirectoriesTable&\Cake\ORM\Association\HasMany $FreepageDirectories
 *
 * @method \App\Model\Entity\FreepageDocument newEmptyEntity()
 * @method \App\Model\Entity\FreepageDocument newEntity(array $data, array $options = [])
 * @method \App\Model\Entity\FreepageDocument[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\FreepageDocument get($primaryKey, $options = [])
 * @method \App\Model\Entity\FreepageDocument findOrCreate($search, ?callable $callback = null, $options = [])
 * @method \App\Model\Entity\FreepageDocument patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\FreepageDocument[] patchEntities(iterable $entities, array $data, array $options = [])
 * @method \App\Model\Entity\FreepageDocument|false save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\FreepageDocument saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\FreepageDocument[]|\Cake\Datasource\ResultSetInterface|false saveMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\FreepageDocument[]|\Cake\Datasource\ResultSetInterface saveManyOrFail(iterable $entities, $options = [])
 * @method \App\Model\Entity\FreepageDocument[]|\Cake\Datasource\ResultSetInterface|false deleteMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\FreepageDocument[]|\Cake\Datasource\ResultSetInterface deleteManyOrFail(iterable $entities, $options = [])
 *
 * @mixin \Medii\TextSerialize\Model\Behavior\TextSerializeBehavior
 * @mixin \App\Model\Behavior\CommonAssociationBehavior
 * @mixin \Medii\File\Model\Behavior\FileBehavior
 * @mixin \Medii\Approval\Model\Behavior\ApprovalBehavior
 */
class FreepageDocumentsTable extends AppTable
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

        $this->setTable('freepage_documents');
        $this->setDisplayField('title');
        $this->setPrimaryKey('id');

        $this->addBehavior('Medii/TextSerialize.TextSerialize', [
            'ignoreFields' => [
                'model'
            ],
        ]);
        $this->addBehavior('CommonAssociation', [
            'isAssociation' => [
                'blocks' => true,
                'metadatas' => true,
            ],
        ]);

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
        if (Configure::read('CustomSettings.Freepages.approve') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
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

        // $this->belongsTo('Files', [
        //     'foreignKey' => 'file_id',
        // ]);
        $this
            ->hasMany('FreepageDirectories')
            ->setForeignKey('freepage_document_id')
            ->setDependent(false)
            ->setCascadeCallbacks(false)
            ->setSaveStrategy("replace");

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
            'approvalTables' => $approvalTables,
        ]);
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
            ->scalar('title')
            ->maxLength('title', 255)
            ->notEmptyString('title');

        $validator
            ->scalar('path')
            ->maxLength('path', 510)
            ->allowEmptyString('path');

        $validator
            ->uuid('file_id')
            ->allowEmptyFile('file_id');

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
            ->allowEmptyFile('summary_files');

        $validator
            ->date('published')
            ->allowEmptyDate('published');

        $validator
            ->dateTime('start_date')
            ->allowEmptyDateTime('start_date');

        $validator
            ->dateTime('end_date')
            ->allowEmptyDateTime('end_date');

        $validator->add('freepage_directories', 'custom', [
            'rule' => function (array $value, array $context) {

                return !empty($value['_ids']) && is_array($value['_ids']);
            },
            'message' => '※階層を選択してください'
        ]);

        return $validator;
    }

    /**
     * Undocumented function
     *
     * @param \Cake\Event\EventInterfac $event
     * @param \Cake\Datasource\EntityInterface $entity
     * @param \ArrayObject $options
     * @return void
     */
    public function beforeSave(EventInterface $event, EntityInterface $entity, ArrayObject $options)
    {
        if (!empty($entity->freepage_directories)) {
            $entity->freepage_directories_tmp = $entity->freepage_directories;
            // Log::error(print_r($entity->freepage_directories_tmp, true));
            unset($entity->freepage_directories);
        }
    }

    /**
     * Undocumented function
     *
     * @param \Cake\Event\EventInterfac $event
     * @param \Cake\Datasource\EntityInterface $entity
     * @param \ArrayObject $options
     * @return void
     */
    public function afterSave(EventInterface $event, EntityInterface $entity, ArrayObject $options)
    {
        if (!empty($entity->freepage_directories_tmp) && !$entity->isNew()) {
            $freepageDirectoriesTable = TableRegistry::getTableLocator()->get('FreepageDirectories');
            $allDir = $freepageDirectoriesTable->find('list')->where(['freepage_document_id' => $entity->id])->toArray();

            foreach ($entity->freepage_directories_tmp as $dir) {
                $dirEntity = $freepageDirectoriesTable->find()->where(['freepage_document_id' => $entity->id, 'parent_id' => $dir->id])->first();

                if (empty($dirEntity)) {
                    $dirEntity = $freepageDirectoriesTable->newEmptyEntity();
                    $dirEntity->parent_id = $dir->id;
                    $dirEntity->type = Configure::read('Site.Settings.FreepageTypeKey.documentKey');
                    $dirEntity->freepage_document_id = $entity->id;
                }
                $dirEntity->title = $entity->title;
                $dirEntity->path = $entity->path;
                $dirEntity->status = $entity->status;
                $dirEntity->start_date = $entity->start_date;
                $dirEntity->end_date = $entity->end_date;
                $dirEntity->public = $entity->public;
                $dirEntity->searchtext = $entity->searchtext;
                $dirEntity->published = $entity->published;

                if ($dirEntity->parent_id === "root") {
                    continue;
                }

                $freepageDirectoriesTable->save($dirEntity);

                if ($dirEntity->id) {
                    unset($allDir[$dirEntity->id]);
                }
            }

            if ($allDir) {
                $freepageDirectoriesTable->deleteAll(['id IN ' => array_keys($allDir)]);
            }
        }
    }

    /**
     * Returns a rules checker object that will be used for validating
     * application integrity.
     *
     * @param \Cake\ORM\RulesChecker $rules The rules object to be modified.
     * @return \Cake\ORM\RulesChecker
     */
    public function buildRules(RulesChecker $rules): RulesChecker
    {
        // $rules->add($rules->existsIn('file_id', 'Files'), ['errorField' => 'file_id']);

        return $rules;
    }
}
