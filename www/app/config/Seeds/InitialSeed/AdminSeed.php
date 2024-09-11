<?php

use Authentication\PasswordHasher\DefaultPasswordHasher;
use Migrations\AbstractSeed;
use Cake\Utility\Text;


/**
 * Admin seed.
 */
class AdminSeed extends AbstractSeed
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

        $data = [
            [
                'id' => 'da4fdc4b-f707-4b76-a76d-e784094376c1',
                'title' => '総合管理者',
                'code' => null,
                'username' => 'admin',
                'password' => $hasher->hash('xxxx'),
                'note' => 'admin / xxxx',
                'role' => 'Admin',
                'email' => 'xxxx',
                'signature' => null,
                'status' => 'published',
                'public' => 'published',
                'created' => '2018-07-10 14:49:03',
                'created_by_admin' => 'da4fdc4b-f707-4b76-a76d-e784094376c1',
                'modified' => '2019-04-12 10:26:35',
                'modified_by_admin' => 'da4fdc4b-f707-4b76-a76d-e784094376c1',
                'superuser' => 1,
            ],
            [
                'id' => '73125fb5-aa62-4015-8490-6e3bca095e6e',
                'title' => 'しのだ',
                'code' => null,
                'username' => 'Sinosino1234',
                'password' => $hasher->hash('Sinosino_1234'),
                'note' => 'Sinosino1234 / Sinosino_1234',
                'role' => 'Admin',
                'email' => 'xxxx',
                'signature' => null,
                'status' => 'published',
                'public' => 'published',
                'created' => '2018-07-10 14:49:03',
                'created_by_admin' => 'da4fdc4b-f707-4b76-a76d-e784094376c1',
                'modified' => '2019-04-12 10:26:35',
                'modified_by_admin' => '73125fb5-aa62-4015-8490-6e3bca095e6e',
                'superuser' => 1,
            ],
        ];

        $table = $this->table('admins');
        $table->insert($data)->save();
    }
}
