<?php

declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * ApprovalRemands Model
 *
 * @method \App\Model\Entity\ApprovalRemand newEmptyEntity()
 * @method \App\Model\Entity\ApprovalRemand newEntity(array $data, array $options = [])
 * @method \App\Model\Entity\ApprovalRemand[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\ApprovalRemand get($primaryKey, $options = [])
 * @method \App\Model\Entity\ApprovalRemand findOrCreate($search, ?callable $callback = null, $options = [])
 * @method \App\Model\Entity\ApprovalRemand patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\ApprovalRemand[] patchEntities(iterable $entities, array $data, array $options = [])
 * @method \App\Model\Entity\ApprovalRemand|false save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\ApprovalRemand saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\ApprovalRemand[]|\Cake\Datasource\ResultSetInterface|false saveMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\ApprovalRemand[]|\Cake\Datasource\ResultSetInterface saveManyOrFail(iterable $entities, $options = [])
 * @method \App\Model\Entity\ApprovalRemand[]|\Cake\Datasource\ResultSetInterface|false deleteMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\ApprovalRemand[]|\Cake\Datasource\ResultSetInterface deleteManyOrFail(iterable $entities, $options = [])
 *
 * @mixin \Medii\TextSerialize\Model\Behavior\TextSerializeBehavior
 * @mixin \App\Model\Behavior\CommonAssociationBehavior
 * @mixin \Medii\File\Model\Behavior\FileBehavior
 * @mixin \Medii\Approval\Model\Behavior\ApprovalBehavior
 */
class ApprovalRemandsTable extends AppTable
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

        $this->setTable('approval_remands');
        $this->setDisplayField('id');
        $this->setPrimaryKey('id');

        $this->belongsTo('CreateAdmins')
            ->setClassName('Admins')
            ->setForeignKey('created_by_admin');

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

        return $validator;
    }
}
