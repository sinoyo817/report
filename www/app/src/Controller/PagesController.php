<?php

declare(strict_types=1);

/**
 * CakePHP(tm) : Rapid Development Framework (https://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright Copyright (c) Cake Software Foundation, Inc. (https://cakefoundation.org)
 * @link      https://cakephp.org CakePHP(tm) Project
 * @since     0.2.9
 * @license   https://opensource.org/licenses/mit-license.php MIT License
 */

namespace App\Controller;

use Cake\Cache\Cache;
use Cake\Collection\Collection;
use Cake\Core\Configure;
use Cake\Http\Exception\BadRequestException;
use Cake\Log\Log;
use Cake\Utility\Hash;

/**
 * Static content controller
 *
 * This controller will render views from templates/Pages/
 *
 * @link https://book.cakephp.org/4/en/controllers/pages-controller.html
 */
class PagesController extends AppController
{
    /**
     * Displays a view
     *
     * @param string ...$path Path segments.
     * @return \Cake\Http\Response|null
     * @throws \Cake\Http\Exception\ForbiddenException When a directory traversal attempt.
     * @throws \Cake\View\Exception\MissingTemplateException When the view file could not
     *   be found and in debug mode.
     * @throws \Cake\Http\Exception\NotFoundException When the view file could not
     *   be found and not in debug mode.
     * @throws \Cake\View\Exception\MissingTemplateException In debug mode.
     */
    public function index()
    {
        $this->set('isTop', true);

        // ◆標準テンプレート用-----------------------------------------------------------------
        // 要件にあったものを適宜利用してください
        $topicsTable = $this->fetchTable('Topics');
        $associated = [];
        
        // カテゴリ表示があるなら
        if (Configure::read('CustomSettings.Topics.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) {
            $associated = ['MasterTopicCategories'];
        }

        //リスト用
        $topicslist = $topicsTable->find('publicPeriod')->contain($associated)->find('OrderByDefault')->limit(3)->toArray();

        // サムネ表示があるなら
        if (Configure::read('CustomSettings.Topics.thumbnail') === Configure::read('Site.Settings.BasicDisplayShowKey.onKey')) {
            array_push($associated, 'Files');
        }

        // サムネイル付き3列用
        $topics3line = $topicsTable->find('publicPeriod')->contain($associated)->find('OrderByDefault')->limit(3)->toArray();
        // サムネイル付き4列用
        $topics4line = $topicsTable->find('publicPeriod')->contain($associated)->find('OrderByDefault')->limit(4)->toArray();

        $this->set(compact('topicslist', 'topics3line', 'topics4line'));
        // ------------------------------------------------------------------------------------

        // TOPイメージ
        $topImagesTable = $this->fetchTable('TopImages');
        $associated = ['Files', 'SpFiles'];
        $topImages = $topImagesTable->find('publicPeriod')->contain($associated)->find('OrderByDefault')->all();

        $this->set('topImages', $topImages);

        // バナー
        $bunnersTable = $this->fetchTable('Bunners');
        $associated = ['Files'];
        $bunners = $bunnersTable->find('publicPeriod')->contain($associated)->find('OrderByDefault')->all();

        $this->set('bunners', $bunners);
    }
}
