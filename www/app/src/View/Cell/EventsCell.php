<?php

declare(strict_types=1);

namespace App\View\Cell;

use Cake\Core\Configure;
use Cake\ORM\Query;
use Cake\View\Cell;

/**
 * Events cell
 */
class EventsCell extends Cell
{
    protected $defaultTable = 'Events';
    /**
     * List of valid options that can be passed into this
     * cell's constructor.
     *
     * @var array<string, mixed>
     */
    protected $_validCellOptions = [];

    /**
     * Initialization logic run at the end of object construction.
     *
     * @return void
     */
    public function initialize(): void
    {
        parent::initialize();
    }

    /**
     * pin display method.
     *
     * @return void
     */
    public function top($limit = 5)
    {
        $table = $this->fetchTable();
        $associated = [
            'EventDates',
            'Files' => function (Query $q) {
                return $q->find('public');
            }
        ];
        if (Configure::read('CustomSettings.Events.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated[] = 'MasterEventCategories';
        }
        if (Configure::read('CustomSettings.Events.area') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated[] = 'MasterAreas';
        }
        $data = $table->find('publicPeriod')
            ->find('isTop')
            ->contain($associated)->limit($limit)->all();

        $this->set(compact('data'));
    }

    /**
     * pin display method.
     *
     * @return void
     */
    public function pin($limit = 3)
    {
        $table = $this->fetchTable();
        $associated = [
            'EventDates',
            'Files' => function (Query $q) {
                return $q->find('public');
            }
        ];
        if (Configure::read('CustomSettings.Events.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated[] = 'MasterEventCategories';
        }
        if (Configure::read('CustomSettings.Events.area') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated[] = 'MasterAreas';
        }
        $data = $table->find('publicPeriod')
            ->find('isTop')
            ->contain($associated)->limit($limit)->all();

        $this->set(compact('data'));
    }

    /**
     * nearSpot display method.
     *
     * @return void
     */
    public function nearEvent($id = null, $lttd = null, $lgtd = null, $limit = 4)
    {
        $table = $this->fetchTable();
        $query = $table->find('peripheral', [
            'lttd' => $lttd,
            'lgtd' => $lgtd,
        ]);
        if (isset($id) && $id) {
            $query = $query->find('ignoreId', ['id' => $id]);
        }
        $associated = [
            'EventDates',
            'Files' => function (Query $q) {
                return $q->find('public');
            }
        ];
        if (Configure::read('CustomSettings.Events.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated[] = 'MasterEventCategories';
        }
        if (Configure::read('CustomSettings.Events.area') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated[] = 'MasterAreas';
        }
        $data = $query->find('publicPeriod')
            ->contain($associated)
            ->select($table->Files)
            ->find('orderByDefault')->limit($limit)->all();

        $this->set(compact('data'));
    }
}
