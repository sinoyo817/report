<?php
declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * UseCodes Model
 *
 * @property \App\Model\Table\MasterWorkCodesTable&\Cake\ORM\Association\BelongsTo $MasterWorkCodes
 *
 * @method \App\Model\Entity\UseCode newEmptyEntity()
 * @method \App\Model\Entity\UseCode newEntity(array $data, array $options = [])
 * @method \App\Model\Entity\UseCode[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\UseCode get($primaryKey, $options = [])
 * @method \App\Model\Entity\UseCode findOrCreate($search, ?callable $callback = null, $options = [])
 * @method \App\Model\Entity\UseCode patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\UseCode[] patchEntities(iterable $entities, array $data, array $options = [])
 * @method \App\Model\Entity\UseCode|false save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\UseCode saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\UseCode[]|\Cake\Datasource\ResultSetInterface|false saveMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\UseCode[]|\Cake\Datasource\ResultSetInterface saveManyOrFail(iterable $entities, $options = [])
 * @method \App\Model\Entity\UseCode[]|\Cake\Datasource\ResultSetInterface|false deleteMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\UseCode[]|\Cake\Datasource\ResultSetInterface deleteManyOrFail(iterable $entities, $options = [])
 *
 * @mixin \Medii\TextSerialize\Model\Behavior\TextSerializeBehavior
 * @mixin \App\Model\Behavior\CommonAssociationBehavior
 * @mixin \Medii\File\Model\Behavior\FileBehavior
 * @mixin \Medii\Approval\Model\Behavior\ApprovalBehavior
 */
class UseCodesTable extends AppTable
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

        $this->setTable('use_codes');
        $this->setDisplayField('id');
        $this->setPrimaryKey('id');

        $fileFields = [];
        $approvalTables = [
            $this,
        ];
        $this->belongsTo('MasterWorkCodes', [
            'foreignKey' => 'master_work_code_id',
        ]);


        $this->addBehavior('Medii/TextSerialize.TextSerialize');
        $this->addBehavior('CommonAssociation', [
            'isAssociation' => [
                'blocks' => false,
                'metadata' => false,
            ],
        ]);
        $this->addBehavior('Medii/File.File', [
            'fileIdFields' => [
                'fields' => $fileFields,
            ],
            'commonAssociation' => [
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
            ->uuid('master_work_code_id')
            ->allowEmptyString('master_work_code_id');

        return $validator;
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
        $rules->add($rules->existsIn('master_work_code_id', 'MasterWorkCodes'), ['errorField' => 'master_work_code_id']);

        return $rules;
    }
}
