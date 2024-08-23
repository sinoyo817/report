<?php
declare(strict_types=1);

use Migrations\AbstractMigration;

class TopImages extends AbstractMigration
{
    /**
     * Change Method.
     *
     * More information on this method is available here:
     * https://book.cakephp.org/phinx/0/en/migrations.html#the-change-method
     * @return void
     */
    public function change(): void
    {
        $this->table('top_images', ['id' => false, 'primary_key' => ['id']])
            ->addColumn('id', 'uuid', [
                'default' => null,
                'limit' => null,
                'null' => false,
            ])
            ->addColumn('title', 'string', [
                'default' => null,
                'limit' => 255,
                'null' => false,
            ])
            ->addColumn('image_id', 'uuid', [
                'default' => null,
                'limit' => null,
                'null' => true,
                'comment' => 'PC画像',
            ])
            ->addColumn('image_alt', 'string', [
                'default' => null,
                'limit' => 255,
                'null' => true,
                'comment' => 'PC代替テキスト',
            ])
            ->addColumn('url', 'string', [
                'default' => null,
                'limit' => 512,
                'null' => true,
                'comment' => 'PC-URL',
            ])
            ->addColumn('url_is_blank', 'char', [
                'default' => '0',
                'limit' => 1,
                'null' => true,
            ])
            ->addColumn('sp_image_id', 'uuid', [
                'default' => null,
                'limit' => null,
                'null' => true,
                'comment' => 'SP画像',
            ])
            ->addColumn('sp_image_alt', 'string', [
                'default' => null,
                'limit' => 255,
                'null' => true,
                'comment' => 'SP代替テキスト',
            ])
            ->addColumn('sp_url', 'string', [
                'default' => null,
                'limit' => 512,
                'null' => true,
                'comment' => 'SP-URL',
            ])
            ->addColumn('sp_url_is_blank', 'char', [
                'default' => '0',
                'limit' => 1,
                'null' => true,
            ])
            ->addColumn('published', 'date', [
                'default' => null,
                'limit' => null,
                'null' => true,
            ])
            ->addColumn('start_date', 'date', [
                'default' => null,
                'limit' => null,
                'null' => true,
            ])
            ->addColumn('end_date', 'date', [
                'default' => null,
                'limit' => null,
                'null' => true,
            ])
            ->addColumn('status', 'string', [
                'default' => 'draft',
                'limit' => 50,
                'null' => true,
            ])
            ->addColumn('public', 'string', [
                'default' => 'unpublished',
                'limit' => 50,
                'null' => true,
            ])
            ->addColumn('searchtext', 'text', [
                'default' => null,
                'limit' => 16777215,
                'null' => true,
            ])
            ->addColumn('created', 'datetime', [
                'default' => null,
                'limit' => null,
                'null' => true,
            ])
            ->addColumn('created_by_admin', 'uuid', [
                'default' => null,
                'limit' => null,
                'null' => true,
            ])
            ->addColumn('created_by_user', 'uuid', [
                'default' => null,
                'limit' => null,
                'null' => true,
            ])
            ->addColumn('modified', 'datetime', [
                'default' => null,
                'limit' => null,
                'null' => true,
            ])
            ->addColumn('modified_by_admin', 'uuid', [
                'default' => null,
                'limit' => null,
                'null' => true,
            ])
            ->addColumn('modified_by_user', 'uuid', [
                'default' => null,
                'limit' => null,
                'null' => true,
            ])
            ->addColumn('cid', 'integer', [
                'autoIncrement' => true,
                'default' => null,
                'limit' => null,
                'null' => false,
            ])
            ->addIndex(
                [
                    'cid',
                ]
            )
            ->create();

        $this->table('top_images_private', ['id' => false, 'primary_key' => ['id']])
            ->addColumn('id', 'uuid', [
                'default' => null,
                'limit' => null,
                'null' => false,
            ])
            ->addColumn('title', 'string', [
                'default' => null,
                'limit' => 255,
                'null' => false,
            ])
            ->addColumn('image_id', 'uuid', [
                'default' => null,
                'limit' => null,
                'null' => true,
                'comment' => 'PC画像',
            ])
            ->addColumn('image_alt', 'string', [
                'default' => null,
                'limit' => 255,
                'null' => true,
                'comment' => 'PC代替テキスト',
            ])
            ->addColumn('url', 'string', [
                'default' => null,
                'limit' => 512,
                'null' => true,
                'comment' => 'PC-URL',
            ])
            ->addColumn('url_is_blank', 'char', [
                'default' => '0',
                'limit' => 1,
                'null' => true,
            ])
            ->addColumn('sp_image_id', 'uuid', [
                'default' => null,
                'limit' => null,
                'null' => true,
                'comment' => 'SP画像',
            ])
            ->addColumn('sp_image_alt', 'string', [
                'default' => null,
                'limit' => 255,
                'null' => true,
                'comment' => 'SP代替テキスト',
            ])
            ->addColumn('sp_url', 'string', [
                'default' => null,
                'limit' => 512,
                'null' => true,
                'comment' => 'SP-URL',
            ])
            ->addColumn('sp_url_is_blank', 'char', [
                'default' => '0',
                'limit' => 1,
                'null' => true,
            ])
            ->addColumn('published', 'date', [
                'default' => null,
                'limit' => null,
                'null' => true,
            ])
            ->addColumn('start_date', 'date', [
                'default' => null,
                'limit' => null,
                'null' => true,
            ])
            ->addColumn('end_date', 'date', [
                'default' => null,
                'limit' => null,
                'null' => true,
            ])
            ->addColumn('status', 'string', [
                'default' => 'draft',
                'limit' => 50,
                'null' => true,
            ])
            ->addColumn('public', 'string', [
                'default' => 'unpublished',
                'limit' => 50,
                'null' => true,
            ])
            ->addColumn('searchtext', 'text', [
                'default' => null,
                'limit' => 16777215,
                'null' => true,
            ])
            ->addColumn('created', 'datetime', [
                'default' => null,
                'limit' => null,
                'null' => true,
            ])
            ->addColumn('created_by_admin', 'uuid', [
                'default' => null,
                'limit' => null,
                'null' => true,
            ])
            ->addColumn('created_by_user', 'uuid', [
                'default' => null,
                'limit' => null,
                'null' => true,
            ])
            ->addColumn('modified', 'datetime', [
                'default' => null,
                'limit' => null,
                'null' => true,
            ])
            ->addColumn('modified_by_admin', 'uuid', [
                'default' => null,
                'limit' => null,
                'null' => true,
            ])
            ->addColumn('modified_by_user', 'uuid', [
                'default' => null,
                'limit' => null,
                'null' => true,
            ])
            ->addColumn('cid', 'integer', [
                'autoIncrement' => true,
                'default' => null,
                'limit' => null,
                'null' => false,
            ])
            ->addIndex(
                [
                    'cid',
                ]
            )
            ->create();
    }
}
