<?php

declare(strict_types=1);

namespace App\Model\Table;

use ArrayObject;
use Cake\Datasource\EntityInterface;
use Cake\Event\EventInterface;
use Cake\Log\Log;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * FreepageDirectories Model
 *
 * @property \App\Model\Table\FreepageDirectoriesTable&\Cake\ORM\Association\BelongsTo $ParentFreepageDirectories
 * @property \App\Model\Table\FreepageDocumentsTable&\Cake\ORM\Association\BelongsTo $FreepageDocuments
 * @property \App\Model\Table\FreepageDirectoriesTable&\Cake\ORM\Association\HasMany $ChildFreepageDirectories
 *
 * @method \App\Model\Entity\FreepageDirectory newEmptyEntity()
 * @method \App\Model\Entity\FreepageDirectory newEntity(array $data, array $options = [])
 * @method \App\Model\Entity\FreepageDirectory[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\FreepageDirectory get($primaryKey, $options = [])
 * @method \App\Model\Entity\FreepageDirectory findOrCreate($search, ?callable $callback = null, $options = [])
 * @method \App\Model\Entity\FreepageDirectory patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\FreepageDirectory[] patchEntities(iterable $entities, array $data, array $options = [])
 * @method \App\Model\Entity\FreepageDirectory|false save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\FreepageDirectory saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\FreepageDirectory[]|\Cake\Datasource\ResultSetInterface|false saveMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\FreepageDirectory[]|\Cake\Datasource\ResultSetInterface saveManyOrFail(iterable $entities, $options = [])
 * @method \App\Model\Entity\FreepageDirectory[]|\Cake\Datasource\ResultSetInterface|false deleteMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\FreepageDirectory[]|\Cake\Datasource\ResultSetInterface deleteManyOrFail(iterable $entities, $options = [])
 *
 * @mixin \Cake\ORM\Behavior\TreeBehavior
 * @mixin \Medii\TextSerialize\Model\Behavior\TextSerializeBehavior
 * @mixin \App\Model\Behavior\CommonAssociationBehavior
 * @mixin \Medii\File\Model\Behavior\FileBehavior
 * @mixin \Medii\Approval\Model\Behavior\ApprovalBehavior
 */
class FreepageDirectoriesTable extends AppTable
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

        $this->setTable('freepage_directories');
        $this->setDisplayField('title');
        $this->setPrimaryKey('id');

        $this->belongsTo('CreateAdmins')
            ->setClassName('Admins')
            ->setForeignKey('created_by_admin');

        $this->belongsTo('ModifiedAdmins')
            ->setClassName('Admins')
            ->setForeignKey('modified_by_admin');

        // $this->belongsTo('ParentFreepageDirectories', [
        //     'className' => 'FreepageDirectories',
        //     'foreignKey' => 'parent_id',
        // ]);

        $this->belongsTo('FreepageDocuments')->setForeignKey('freepage_document_id');

        // $this->hasMany('ChildFreepageDirectories', [
        //     'className' => 'FreepageDirectories',
        //     'foreignKey' => 'parent_id',
        // ]);

        $this->addBehavior('Medii/TextSerialize.TextSerialize', []);

        $this->addBehavior('Tree', [
            'recoverOrder' => ['lft' => 'ASC'],
            // 'priority' => 2,
            // 'cascadeCallbacks' => true,
        ]);
        $this->addBehavior('Medii/Approval.Approval', [
            'approvalTables' => [],
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
            ->notEmptyString('parent_id', '階層を選択してください');

        $validator
            ->maxLength('type', 255)
            ->notEmptyString('type', 'タイプを選択してください');

        $validator
            ->maxLength('title', 255)
            ->notEmptyString('title', 'タイトルを入力してください');

        $validator
            ->notEmptyString('path', 'URLを入力してください');

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
        $url = [];

        if ($entity->crumbsPath) {
            foreach ($entity->crumbsPath as $p) {
                $url[] = $p->path;
            }
        }

        $url[] = $entity->path;

        $entity->path_url = implode("/", $url);
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
        $descendants = $this->find('children', ["for" => $entity->id]);

        foreach ($descendants as $v) {
            $v->setDirty('modified', true);
            $this->save($v);
        }
    }

    /**
     * findCreatedByAdminOnlyDocument method
     *
     * @param \Cake\ORM\Query $query
     * @param array $options
     * @return void
     */
    public function findCreatedByAdminOnlyDocument(Query $query, array $options)
    {
        $admin = $options['admin'];
        return $query->where(
            [
                'OR' => [
                    ["{$this->_alias}.type" => "document", "{$this->_alias}.created_by_admin" => $admin->admin_id],
                    ["{$this->_alias}.type" => "directory"],
                ]
            ]
        );
    }

    /**
     * findDirectory method
     *
     * @param \Cake\ORM\Query $query
     * @param array $options
     * @return void
     */
    public function findDirectory(Query $query, array $options)
    {
        return $query->where(["{$this->_alias}.type" => "directory"]);
    }

    /**
     * findDocument method
     *
     * @param \Cake\ORM\Query $query
     * @param array $options
     * @return void
     */
    public function findDocument(Query $query, array $options)
    {
        return $query->where(["{$this->_alias}.type" => "document"]);
    }

    /**
     * findIgnoreRoot method
     *
     * @param \Cake\ORM\Query $query
     * @param array $options
     * @return void
     */
    public function findIgnoreRoot(Query $query, array $options)
    {
        return $query->where(["{$this->_alias}.parent_id != " => "root"]);
    }
}
