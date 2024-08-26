<?php

use Authentication\PasswordHasher\DefaultPasswordHasher;
use Migrations\AbstractSeed;
use Cake\Utility\Text;


/**
 * Admin seed.
 */
class MasterWorkCodesSeed extends AbstractSeed
{
    /**
     * Run Method.
     *
     * Write your database seeder using this method.
     *
     * More information on writing seeds is available here:
     * http://docs.phinx.org/en/latest/seeding.html
     *
     * @return void
     */
    public function run(): void
    {
        $hasher = new DefaultPasswordHasher();

        $MasterWorks= [
            1  =>'G全体MTG',
            2  =>'チームMTG',
            3  =>'ワークグループMTG',
            4  =>'社内業務',
            5  =>'書類作成',
            6  =>'サポート',
            7  =>'該当なし',
            8  =>'（営業サポート）自治体公募提案',
            9  =>'（営業サポート）その他提案',
            10 =>'（営業サポート）リテンション',
            11 =>'（営業サポート）工数作成',
            12 =>'（営業サポート）調査・MTG',
            13 =>'（営業サポート）その他',
            14 =>'（制作）要件定義',
            15 =>'（制作）仕様策定',
            16 =>'（制作）進捗管理',
            17 =>'（制作）プログラム開発',
            18 =>'（制作）各種テスト',
            19 =>'（制作）問い合わせ対応・調査',
        ];

        $data = [];
        foreach ($MasterWorks as $key => $work) {
            $data[] = [
                'id' => Text::uuid(),
                'title' => $work,
                'sequence' => $key,
                'status' => 'published',
                'public' => 'published',
                'created_by_admin' => 'da4fdc4b-f707-4b76-a76d-e784094376c1',
                'modified_by_admin' => 'da4fdc4b-f707-4b76-a76d-e784094376c1',
            ];
        }

        $table = $this->table('master_work_codes');
        $table->insert($data)->save();
        $table = $this->table('master_work_codes_private');
        $table->insert($data)->save();
    }
}
