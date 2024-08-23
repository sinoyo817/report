<?php

declare(strict_types=1);

use Migrations\AbstractSeed;

/**
 * FreepageDirectory seed.
 */
class FreepageDirectorySeed extends AbstractSeed
{
    /**
     * Run Method.
     *
     * Write your database seeder using this method.
     *
     * More information on writing seeds is available here:
     * https://book.cakephp.org/phinx/0/en/seeding.html
     *
     * @return void
     */
    public function run(): void
    {
        $data = [
            "id" => "c1e2d611-b06a-4c3d-b86f-17863d09d9f5",
            "parent_id" => "root",
            "type" => "directory",
            "lft" => 1,
            "rght" => 2,
            "title" => "トップページ",
            "path" => "",
            "path_url" =>  "",
            "freepage_document_id" => "",
            "status" => "published",
            "public" => "published",
            "created" => "2023-12-25 09:00:00",
            "modified" => "2023-12-25 09:00:00",
            "cid" => 1,
        ];

        $table = $this->table('freepage_directories');
        $table->insert($data)->save();
    }
}
