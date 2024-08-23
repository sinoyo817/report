<?php
declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;
use Cake\Core\Configure;

/**
 * Contacts Model
 *
 * @property \App\Model\Table\FilesTable&\Cake\ORM\Association\BelongsTo $Files
 * @property \App\Model\Table\MasterContactCategoriesTable&\Cake\ORM\Association\BelongsToMany $MasterContactCategories
 *
 * @method \App\Model\Entity\Contact newEmptyEntity()
 * @method \App\Model\Entity\Contact newEntity(array $data, array $options = [])
 * @method \App\Model\Entity\Contact[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\Contact get($primaryKey, $options = [])
 * @method \App\Model\Entity\Contact findOrCreate($search, ?callable $callback = null, $options = [])
 * @method \App\Model\Entity\Contact patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\Contact[] patchEntities(iterable $entities, array $data, array $options = [])
 * @method \App\Model\Entity\Contact|false save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Contact saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Contact[]|\Cake\Datasource\ResultSetInterface|false saveMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\Contact[]|\Cake\Datasource\ResultSetInterface saveManyOrFail(iterable $entities, $options = [])
 * @method \App\Model\Entity\Contact[]|\Cake\Datasource\ResultSetInterface|false deleteMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\Contact[]|\Cake\Datasource\ResultSetInterface deleteManyOrFail(iterable $entities, $options = [])
 *
 * @mixin \Medii\TextSerialize\Model\Behavior\TextSerializeBehavior
 * @mixin \App\Model\Behavior\CommonAssociationBehavior
 * @mixin \Medii\File\Model\Behavior\FileBehavior
 * @mixin \Medii\Approval\Model\Behavior\ApprovalBehavior
 */
class ContactsTable extends AppTable
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

        $this->setTable('contacts');
        $this->setDisplayField('name');
        $this->setPrimaryKey('id');

        $this->addBehavior('Medii/TextSerialize.TextSerialize');
        $this->addBehavior('CommonAssociation', [
            'isAssociation' => [
                'blocks' => false,
                'metadatas' => false,
            ],
        ]);

        $approvalTables = $fileFields =[];

        // 画像添付
        if (Configure::read('CustomSettings.Contacts.file') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            // $this->belongsTo('Files')
            //     ->setForeignKey('file_id')
            //     ->setClassName('Medii/File.Files')
            //     ->setDependent(true);

            // $fileFields[] = 'file_id';
        }
        
        // ジャンル
        if (Configure::read('CustomSettings.Contacts.genre') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $this->belongsToMany('MasterContactCategories', [
                'joinTable' => 'master_contact_categories_contacts',
            ])
                ->setForeignKey('contact_id')
                ->setTargetForeignKey('master_contact_category_id')
                ->setCascadeCallbacks(true)
                ->setDependent(true);

            $approvalTables[] = $this->MasterContactCategories;
        }

        // 住所
        if (Configure::read('CustomSettings.Contacts.address') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            $this->belongsTo('MasterPrefectures', [
                'foreignKey' => 'prefecture_id',
            ]);

            $approvalTables[] = $this->MasterPrefectures;
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
            'approvalTables' =>  $approvalTables,
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
            ->notEmptyString('title', 'お名前（ご担当者名）を入力してください')
            ->maxLength('title', 255)
            ->requirePresence('title', 'create');        

        $validator
            ->notEmptyString('email', 'メールアドレスを入力してください')
            ->requirePresence('email', 'create')
            ->email('email', true, 'メールアドレスの形式が不正です。正しいメールアドレスを半角文字で入力してください。');

        $validator
            ->notEmptyString('zip_code', '郵便番号を入力してください')
            ->add('zip_code', 'custom', [
                'rule' => function ($value, $context) {
                    if (!$value) {
                        return false;
                    }
                    if (!preg_match("/^([0-9])+$/u", $value)) {
                        return '郵便番号は半角数字で入力してください';
                    }
                    if (!(strlen($value) == 7)) {
                        return '郵便番号は7桁で入力してください';
                    }
                    return true;
                },
                'message' => '郵便番号を正しく入力してください'
            ]);

        $validator->notEmptyString('prefecture_id', '都道府県を選択してください');

        $validator
            ->notEmptyString('address_city', '市区町村を入力してください')
            ->maxLength('address_city', 255);

        $validator
            ->notEmptyString('address_local', '以降の住所を入力してください')
            ->maxLength('address_local', 255);

        $validator
            ->notEmptyString('tel', 'お電話番号を入力してください')
            ->add('tel', 'regex', [
                'rule' => function ($value, $context) {
                    return (bool) preg_match('/^[0-9]{10}$|^[0-9]{11}$/', $value);
                },
                'message' => "電話番号は半角数字のみ・ハイフンなしで入力してください",
                'last' => true,
            ])
            ->maxLength('tel', 11, "電話番号は正しく入力してください");

        $validator->notEmptyString('gender', '性別を選択してください');

        $validator
            ->notEmptyString('birthday', '生年月日を入力してください')
            ->maxLength('address_local', 255);

        $validator->add('master_contact_categories', 'custom', [
                'rule' => function (array $value, array $context) {
                    return !empty($value['_ids']) && is_array($value['_ids']);
                },
                'message' => '興味のあるジャンルを選択してください'
            ]);

        // $validator
        //     ->uuid('file_id')
        //     ->allowEmptyFile('file_id');

        $validator
            ->notEmptyString('summary', 'お問合せ内容を⼊⼒してください')
            ->maxLength('summary', 1000, 'お問合せ内容は1000文字以内で入力してください');

        $validator
            ->add('is_agree', 'length', [
                'rule' => ['comparison', "==", 1],
                'message' => __('「プライバシーポリシー」に同意してください')
            ]);

        return $validator;
    }

    // /**
    //  * Returns a rules checker object that will be used for validating
    //  * application integrity.
    //  *
    //  * @param \Cake\ORM\RulesChecker $rules The rules object to be modified.
    //  * @return \Cake\ORM\RulesChecker
    //  */
    // public function buildRules(RulesChecker $rules): RulesChecker
    // {
    //     $rules->add($rules->existsIn('file_id', 'Files'), ['errorField' => 'file_id']);

    //     return $rules;
    // }
}
