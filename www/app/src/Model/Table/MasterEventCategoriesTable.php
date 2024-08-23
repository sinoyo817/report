<?php

declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * MasterEventCategories Model
 *
 * @property \App\Model\Table\EventsTable&\Cake\ORM\Association\BelongsToMany $Events
 * @property \App\Model\Table\EventsPrivateTable&\Cake\ORM\Association\BelongsToMany $EventsPrivate
 *
 * @method \App\Model\Entity\MasterEventCategory newEmptyEntity()
 * @method \App\Model\Entity\MasterEventCategory newEntity(array $data, array $options = [])
 * @method \App\Model\Entity\MasterEventCategory[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\MasterEventCategory get($primaryKey, $options = [])
 * @method \App\Model\Entity\MasterEventCategory findOrCreate($search, ?callable $callback = null, $options = [])
 * @method \App\Model\Entity\MasterEventCategory patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\MasterEventCategory[] patchEntities(iterable $entities, array $data, array $options = [])
 * @method \App\Model\Entity\MasterEventCategory|false save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\MasterEventCategory saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\MasterEventCategory[]|\Cake\Datasource\ResultSetInterface|false saveMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterEventCategory[]|\Cake\Datasource\ResultSetInterface saveManyOrFail(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterEventCategory[]|\Cake\Datasource\ResultSetInterface|false deleteMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterEventCategory[]|\Cake\Datasource\ResultSetInterface deleteManyOrFail(iterable $entities, $options = [])
 *
 * @mixin \Medii\TextSerialize\Model\Behavior\TextSerializeBehavior
 * @mixin \App\Model\Behavior\CommonAssociationBehavior
 * @mixin \Medii\File\Model\Behavior\FileBehavior
 * @mixin \Medii\Approval\Model\Behavior\ApprovalBehavior
 */
class MasterEventCategoriesTable extends AppTable
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

        $this->setTable('master_event_categories');
        $this->setDisplayField('title');
        $this->setPrimaryKey('id');

        $this->addBehavior('ADmad/Sequence.Sequence', [
            'sequenceField' => 'sequence',
        ]);

        $this->addBehavior('Medii/Approval.Approval', [
            'approvalTables' => [
                $this,
            ],
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
            ->notEmptyString('title', '※タイトルを入力してください');

        return $validator;
    }
}
