<?php
declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * MasterGroups Model
 *
 * @method \App\Model\Entity\MasterGroup newEmptyEntity()
 * @method \App\Model\Entity\MasterGroup newEntity(array $data, array $options = [])
 * @method \App\Model\Entity\MasterGroup[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\MasterGroup get($primaryKey, $options = [])
 * @method \App\Model\Entity\MasterGroup findOrCreate($search, ?callable $callback = null, $options = [])
 * @method \App\Model\Entity\MasterGroup patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\MasterGroup[] patchEntities(iterable $entities, array $data, array $options = [])
 * @method \App\Model\Entity\MasterGroup|false save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\MasterGroup saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\MasterGroup[]|\Cake\Datasource\ResultSetInterface|false saveMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterGroup[]|\Cake\Datasource\ResultSetInterface saveManyOrFail(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterGroup[]|\Cake\Datasource\ResultSetInterface|false deleteMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\MasterGroup[]|\Cake\Datasource\ResultSetInterface deleteManyOrFail(iterable $entities, $options = [])
 *
 * @mixin \Medii\TextSerialize\Model\Behavior\TextSerializeBehavior
 * @mixin \App\Model\Behavior\CommonAssociationBehavior
 * @mixin \Medii\Approval\Model\Behavior\ApprovalBehavior
 */
class MasterGroupsTable extends AppTable
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

        $this->setTable('master_groups');
        $this->setDisplayField('title');
        $this->setPrimaryKey('id');

        $approvalTables = [];

        $this->addBehavior('ADmad/Sequence.Sequence', [
            'sequenceField' => 'sequence',
        ]);

        $this->addBehavior('Medii/TextSerialize.TextSerialize');
        $this->addBehavior('CommonAssociation', [
            'isAssociation' => [
                'blocks' => false,
                'metadata' => false,
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
            ->allowEmptyString('title');

        $validator
            ->email('email')
            ->allowEmptyString('email');

        $validator
            ->scalar('mail_body')
            ->maxLength('mail_body', 255)
            ->allowEmptyString('mail_body');

        $validator
            ->scalar('note')
            ->allowEmptyString('note');

        return $validator;
    }
}
