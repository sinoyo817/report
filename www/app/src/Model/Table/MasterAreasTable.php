<?php

declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * MasterAreas Model
 *
 * @property \App\Model\Table\EventsTable&\Cake\ORM\Association\BelongsToMany $Events
 * @property \App\Model\Table\EventsPrivateTable&\Cake\ORM\Association\BelongsToMany $EventsPrivate
 *
 * @method \App\Model\Entity\MasterArea newEmptyEntity()
 * @method \App\Model\Entity\MasterArea newEntity(array $data, array $options = [])
 * @method \App\Model\Entity\MasterArea[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\MasterArea get($primaryKey, $options = [])
 * @method \App\Model\Entity\MasterArea findOrCreate($search, ?callable $callback = null, $options = [])
 * @method \App\Model\Entity\MasterArea patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\MasterArea[] patchEntities(iterable $entities, array $data, array $options = [])
 * @method \App\Model\Entity\MasterArea|false save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\MasterArea saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\MasterArea[]|\Cake\Datasource\ResultSetInterface|false saveMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterArea[]|\Cake\Datasource\ResultSetInterface saveManyOrFail(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterArea[]|\Cake\Datasource\ResultSetInterface|false deleteMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterArea[]|\Cake\Datasource\ResultSetInterface deleteManyOrFail(iterable $entities, $options = [])
 *
 * @mixin \Medii\TextSerialize\Model\Behavior\TextSerializeBehavior
 * @mixin \App\Model\Behavior\CommonAssociationBehavior
 * @mixin \Medii\File\Model\Behavior\FileBehavior
 * @mixin \Medii\Approval\Model\Behavior\ApprovalBehavior
 */
class MasterAreasTable extends AppTable
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

        $this->setTable('master_areas');
        $this->setDisplayField('title');
        $this->setPrimaryKey('id');

        $this->addBehavior('ADmad/Sequence.Sequence', [
            'sequenceField' => 'sequence',
        ]);

        $this->addBehavior('Medii/Approval.Approval', [
            'approvalTables' => [
                $this
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
            ->requirePresence('title', 'create')
            ->notEmptyString('title');

        $validator
            ->scalar('class')
            ->maxLength('class', 255)
            ->allowEmptyString('class');


        return $validator;
    }
}
