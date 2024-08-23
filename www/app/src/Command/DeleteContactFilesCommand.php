<?php

declare(strict_types=1);

namespace App\Command;

use Cake\Command\Command;
use Cake\Console\Arguments;
use Cake\Console\ConsoleIo;
use Cake\Console\ConsoleOptionParser;
use Cake\Core\Configure;
use Cake\Log\Log;

use Cake\ORM\TableRegistry;
use Cake\Filesystem\Folder;
use Cake\I18n\FrozenTime;

/**
 * DeleteContactFiles command.
 */
class DeleteContactFilesCommand extends Command
{
    /**
     * Hook method for defining this command's option parser.
     *
     * @see https://book.cakephp.org/4/en/console-commands/commands.html#defining-arguments-and-options
     * @param \Cake\Console\ConsoleOptionParser $parser The parser to be defined
     * @return \Cake\Console\ConsoleOptionParser The built parser.
     */
    public function buildOptionParser(ConsoleOptionParser $parser): ConsoleOptionParser
    {
        $parser = parent::buildOptionParser($parser);

        return $parser;
    }

    public function initialize(): void
    {
        define('FILE_PATH', dirname(dirname(dirname(dirname(__FILE__)))). '/files/Contacts/');
    }

    /**
     * Implement this method with your command's logic.
     *
     * @param \Cake\Console\Arguments $args The command arguments.
     * @param \Cake\Console\ConsoleIo $io The console io
     * @return null|void|int The exit code or null for success
     */
    public function execute(Arguments $args, ConsoleIo $io)
    {
        $now = FrozenTime::now();
        $del_time = $now->subHours(1);
 
        // DBから１時間以上前のレコードを削除
        $table = $this->fetchTable('Files');
        $result = $table->deleteAll(['model' => 'Contacts', 'created <' => $del_time]);

        $folder = new Folder(FILE_PATH);
        $subfolders = $folder->subdirectories();

        foreach ($subfolders as $subfolder) {
            // フォルダのタイムスタンプを取得
            $timestamp = new FrozenTime(filemtime($subfolder)); 

            // １時間より前の場合、サブフォルダごと削除
            if ($now->diffInHours($timestamp) >= 1) {
                $folderToDelete = new Folder($subfolder);
                $folderToDelete->delete();
            }
        }
    }
}
