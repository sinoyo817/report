<?php

declare(strict_types=1);

namespace App\Model\Table;

use App\Model\Table\AppTable;
use ArrayObject;
use Cake\Datasource\EntityInterface;
use Cake\Event\EventInterface;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\Validation\Validator;

/**
 * Admins Model
 *
 * @method \App\Model\Entity\Admin newEmptyEntity()
 * @method \App\Model\Entity\Admin newEntity(array $data, array $options = [])
 * @method \App\Model\Entity\Admin[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\Admin get($primaryKey, $options = [])
 * @method \App\Model\Entity\Admin findOrCreate($search, ?callable $callback = null, $options = [])
 * @method \App\Model\Entity\Admin patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\Admin[] patchEntities(iterable $entities, array $data, array $options = [])
 * @method \App\Model\Entity\Admin|false save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Admin saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Admin[]|\Cake\Datasource\ResultSetInterface|false saveMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\Admin[]|\Cake\Datasource\ResultSetInterface saveManyOrFail(iterable $entities, $options = [])
 * @method \App\Model\Entity\Admin[]|\Cake\Datasource\ResultSetInterface|false deleteMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\Admin[]|\Cake\Datasource\ResultSetInterface deleteManyOrFail(iterable $entities, $options = [])
 *
 * @mixin \Cake\ORM\Behavior\TimestampBehavior
 */
class AdminsTable extends AppTable
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

        $this->setTable('admins');
        $this->setDisplayField('title');
        $this->setPrimaryKey('id');

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
            ->scalar('title')
            ->maxLength('title', 255)
            // ->requirePresence('title', 'create')
            ->notEmptyString('title', '名前を入力してください');

        $validator
            ->scalar('username')
            ->maxLength('username', 255)
            // ->requirePresence('username', 'create')
            ->notEmptyString('username', 'ログインIDを入力してください')
            ->add('username', [
                'mix' => [
                    'rule' => ['custom', "/^(?=.*?[a-z])(?=.*?[0-9])[a-zA-Z0-9_]{8,255}+$/"],
                    'message' => 'ログインIDは8文字以上英数混在で入力してください',
                    'last' => true,
                ],
            ])
            ->add('username', 'unique', ['rule' => 'validateUnique', 'provider' => 'table', 'message' => 'すでに使われているログインIDです']);

        $validator
            ->scalar('password')
            ->maxLength('password', 255)
            // ->requirePresence('password', 'create')
            ->notEmptyString('password', 'パスワードを入力してください')
            ->add('password_raw', [
                'mix' => [
                    'rule' => ['custom', "/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])[a-zA-z0-9_]{8,72}+$/"],
                    'message' => 'パスワードは8文字以上72文字以内、英[大文字小文字]数混在で入力してください',
                    'last' => true,
                ],
            ]);

        $validator
            ->scalar('role')
            ->maxLength('role', 50)
            ->notEmptyString('role', '権限を選択してください');

        $validator
            ->email('email', false, 'メールアドレスの形式が不正です。')
            // ->requirePresence('email', 'create')
            ->notEmptyString('email', 'メールアドレスを入力してください');

        $validator
            // ->requirePresence('password_new', 'create')
            ->allowEmptyString('password_new')
            ->add('password_raw', [
                'mix' => [
                    'rule' => ['custom', "/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])[a-zA-z0-9_]{14,50}+$/"],
                    'message' => 'パスワードは14文字以上、英[大文字小文字]数混在で入力してください',
                    'last' => true,
                ],
            ]);

        $validator
            // ->requirePresence('password_confirm', 'create')
            ->notEmptyString('password_confirm', '※新規パスワード(確認用）を入力してください', function ($context) {
                return isset($context['data']['password_new']) && $context['data']['password_new'];
            })
            ->equalToField('password_confirm', 'password_new', '※パスワードと一致しません。確認して再度入力してください');


        return $validator;
    }

    /**
     * ChangePassword validation rules.
     *
     * @param \Cake\Validation\Validator $validator Validator instance.
     * @return \Cake\Validation\Validator
     */
    public function validationChangePassword(Validator $validator): Validator
    {

        $validator
            // ->requirePresence('password_new', 'create')
            ->notEmptyString('current_password', '現在のパスワードを入力してください');


        $validator
            // ->requirePresence('password_new', 'create')
            ->notEmptyString('password_new', '新規パスワードを入力してください')
            ->add('password_raw', [
                'mix' => [
                    'rule' => ['custom', "/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])[a-zA-z0-9_]{14,50}+$/"],
                    'message' => 'パスワードは14文字以上、英[大文字小文字]数混在で入力してください',
                    'last' => true,
                ],
            ]);

        $validator
            // ->requirePresence('password_confirm', 'create')
            ->notEmptyString('password_confirm', '※新規パスワード(確認用）を入力してください', function ($context) {
                return isset($context['data']['password_new']) && $context['data']['password_new'];
            })
            ->equalToField('password_confirm', 'password_new', '※パスワードと一致しません。確認して再度入力してください');

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
        if ($entity->password_new) {
            $entity->password = $entity->password_new;
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
        $rules->add($rules->isUnique(['username']), ['errorField' => 'username']);

        return $rules;
    }

    public function findAuth(Query $query, array $options): Query
    {
        return $query->where([
            $this->aliasField('public') => 'published',
        ]);
    }

    public function findAuthMng(Query $query, array $options): Query
    {
        return $query->where([
            $this->aliasField('public') => 'published',
            $this->aliasField('superuser') => 1,
        ]);
    }

    public function findIgnoreSuperuser(Query $query, array $options): Query
    {
        return $query->where([
            $this->aliasField('superuser') => 0,
        ]);
    }
}
