<?php

declare(strict_types=1);

namespace App\View\Cell;

use Cake\ORM\Query;
use Cake\View\Cell;
use Cake\Core\Configure;

/**
 * TopTopics cell
 */
class TopTopicsCell extends Cell
{
    protected $defaultTable = 'Topics';
    /**
     * List of valid options that can be passed into this
     * cell's constructor.
     *
     * @var array<string, mixed>
     */
    protected $_validCellOptions = ['limit'];

    protected $limit = 3;

    /**
     * Initialization logic run at the end of object construction.
     *
     * @return void
     */
    public function initialize(): void
    {
    }

    /**
     * child display method.
     *
     * @return void
     */
    public function display($isTop = false, $isThumbnail = true)
    {
        $associated = [];
        // カテゴリ表示があるなら
        if (Configure::read('CustomSettings.Topics.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated = ['MasterTopicCategories'];
        }

        // サムネ表示があるなら
        if ($isThumbnail && (Configure::read('CustomSettings.Topics.thumbnail') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey'))) {
            array_push($associated, 'Files');
        }

        $table = $this->fetchTable();
        $data = $table
            ->find('publicPeriod')
            ->contain($associated)
            ->order([
                'Topics.created' => 'desc', 'Topics.modified' => 'desc'
            ])
            ->limit($this->limit)
            ->all();

        $this->set('data', $data);
        $this->set('isTop', $isTop);
        $this->set('isThumbnail', $isThumbnail);
    }
}
