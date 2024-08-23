<?php
declare(strict_types=1);

namespace App\Model\Table;

use ArrayObject;
use Cake\Core\Configure;
use Cake\Event\EventInterface;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Bunners Model
 *
 * @property \App\Model\Table\FilesTable&\Cake\ORM\Association\BelongsTo $Files
 *
 * @method \App\Model\Entity\Bunner newEmptyEntity()
 * @method \App\Model\Entity\Bunner newEntity(array $data, array $options = [])
 * @method \App\Model\Entity\Bunner[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\Bunner get($primaryKey, $options = [])
 * @method \App\Model\Entity\Bunner findOrCreate($search, ?callable $callback = null, $options = [])
 * @method \App\Model\Entity\Bunner patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\Bunner[] patchEntities(iterable $entities, array $data, array $options = [])
 * @method \App\Model\Entity\Bunner|false save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Bunner saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Bunner[]|\Cake\Datasource\ResultSetInterface|false saveMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\Bunner[]|\Cake\Datasource\ResultSetInterface saveManyOrFail(iterable $entities, $options = [])
 * @method \App\Model\Entity\Bunner[]|\Cake\Datasource\ResultSetInterface|false deleteMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\Bunner[]|\Cake\Datasource\ResultSetInterface deleteManyOrFail(iterable $entities, $options = [])
 *
 * @mixin \Medii\TextSerialize\Model\Behavior\TextSerializeBehavior
 * @mixin \App\Model\Behavior\CommonAssociationBehavior
 * @mixin \Medii\File\Model\Behavior\FileBehavior
 * @mixin \Medii\Approval\Model\Behavior\ApprovalBehavior
 */
class BunnersTable extends AppTable
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

        $this->setTable('bunners');
        $this->setDisplayField('title');
        $this->setPrimaryKey('id');

        $fileFields = [];
        $approvalTables = [
            $this,
        ];
        $this->belongsTo('Files', [
            'foreignKey' => 'file_id',
            'className' => 'Medii/File.Files',
        ]);
        $fileFields[] = 'file_id';

        $this->addBehavior('Translate', [
            "allowEmptyTranslations" => true,
            "strategyClass" => \Cake\ORM\Behavior\Translate\ShadowTableStrategy::class
        ]);

        $this->addBehavior('Medii/TextSerialize.TextSerialize');
        $this->addBehavior('CommonAssociation', [
            'isAssociation' => [
                'blocks' => false,
                'metadata' => false,
            ],
        ]);

        if (Configure::read('CustomSettings.Option.i18n') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $this->addBehavior('Translate', [
                'allowEmptyTranslations' => true,
                'strategyClass' => \Cake\ORM\Behavior\Translate\ShadowTableStrategy::class,
            ]);
        }

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
        $validator = $this->validationCommon($validator);

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
            ->uuid('file_id')
            ->allowEmptyFile('file_id');

        $validator
            ->scalar('file_alt')
            ->maxLength('file_alt', 255)
            ->allowEmptyFile('file_alt');

        $validator
            ->scalar('url')
            ->maxLength('url', 512)
            ->allowEmptyString('url');

        $validator
            ->scalar('url_is_blank')
            ->maxLength('url_is_blank', 1)
            ->allowEmptyString('url_is_blank');

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
     * Returns a rules checker object that will be used for validating
     * application integrity.
     *
     * @param \Cake\ORM\RulesChecker $rules The rules object to be modified.
     * @return \Cake\ORM\RulesChecker
     */
    public function buildRules(RulesChecker $rules): RulesChecker
    {
        $rules->add($rules->existsIn('file_id', 'Files'), ['errorField' => 'file_id']);

        return $rules;
    }
}
