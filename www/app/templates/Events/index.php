<?php

/**
 * @var \App\View\AppView $this
 * @var \App\Model\Entity\Topic[]|\Cake\Collection\CollectionInterface $datas
 */

use Cake\Chronos\Chronos;
use Cake\Core\Configure;
use Cake\Routing\Router;
use Cake\Utility\Hash;

$this->Breadcrumbs->add('イベント', null, [
    'aria-current' => "page"
]);

$this->Form->setTemplates([
    'nestingLabel' => '{{hidden}}{{input}}<label{{attrs}}>{{text}}</label>',
    'formGroup' => '{{input}}{{label}}',
    'radioWrapper' => '<span>{{label}}</span>',
    'checkboxWrapper' => '<span>{{label}}</span>',
    'inputContainer' => '{{content}}',
    'inputContainerError' => '{{content}}',
]);

$this->Html->css('/events/css/event.css', ['block' => true]);

$this->Html->css([
    '/js/flatpickr/dist/flatpickr.min.css',
    '/js/flatpickr/dist/themes/material_green.css'
], ['block' => true]);

$this->Html->script([
    '/js/flatpickr/dist/flatpickr.min.js',
    '/js/flatpickr/dist/l10n/ja.js',
], ['block' => 'scriptBody']);

$dates = h($this->request->getQuery('event_dates') ?? "");

$js = <<<JS
$(function () {
    $('.search-block .search-btn-sp .filter-block').click(function (e) {
        $(this).parents().next('form').toggleClass('open');
        $('.search-label:first-child+.search-item').addClass('open');
        $('.search-label:first-child').addClass('active');
        $('body').css('overflow-y','hidden');
        $('.search-block').css('z-index','21');
    });
    $('.search-block form .tab .search-label').click(function (e) {
        $(this).addClass('active').siblings().removeClass('active , open');
        $(this).next().addClass('open');
        e.preventDefault();
    });
    $('.search-block form >.btn-close').click(function (e) {
        $(this).parents().removeClass('open');
        $('.search-label:first-child+.search-item').removeClass('open');
        $('.search-block form .tab .search-label').siblings().removeClass('active , open');
        $('body').css('overflow-y','auto');
        $('.search-block').css('z-index','2');
        e.preventDefault();
    });
    $('.search-block form .tab .search-item .btn-close').click(function (e) {
        $(this).parent().prev('.search-label').removeClass('active');
        $(this).parent('.search-item').removeClass('open');
        e.preventDefault();
    });
});

document.addEventListener('DOMContentLoaded', function(){
    const areaClearBtn = document.getElementById('area-clear-btn');
    if(areaClearBtn){
        areaClearBtn.addEventListener('click', function(e){
            e.preventDefault();
            const inputs = document.querySelectorAll('#area-area input');
            if(inputs.length > 0){
                for(let i = 0; i < inputs.length; i++){
                    const el = inputs[i];
                    el.value = "";
                    el.checked = false;
                    el.selected = false;
                }
            }
        })
    }
    const checkAllArea = document.getElementById('allArea');
    if(checkAllArea){
        checkAllArea.addEventListener('change', function(e){
            e.preventDefault();
            const checked = e.target.checked;

            const inputs = document.querySelectorAll('#area-area input');
            if(inputs.length > 0){
                for(let i = 0; i < inputs.length; i++){
                    const el = inputs[i];
                    el.checked = checked;
                }
            }
        })
    }
    const categoryClearBtn = document.getElementById('category-clear-btn');
    if(categoryClearBtn){
        categoryClearBtn.addEventListener('click', function(e){
            e.preventDefault();
            const inputs = document.querySelectorAll('#category-area input');
            if(inputs.length > 0){
                for(let i = 0; i < inputs.length; i++){
                    const el = inputs[i];
                    el.value = "";
                    el.checked = false;
                    el.selected = false;
                }
            }
        })
    }
    const checkAllCategory = document.getElementById('allCategory');
    if(checkAllCategory){
        checkAllCategory.addEventListener('change', function(e){
            e.preventDefault();
            const checked = e.target.checked;

            const inputs = document.querySelectorAll('#category-area input');
            if(inputs.length > 0){
                for(let i = 0; i < inputs.length; i++){
                    const el = inputs[i];
                    el.checked = checked;
                }
            }
        })
    }

});

jQuery(function($){
    $(function(){
        $('#event-date').flatpickr({
            locale: 'ja',
            ariaDateFormat: 'Y年n月j日',
            dateFormat: "Y-m-d",
            inline: true,
            mode: "multiple",
            // showMonths: 3,
            monthSelectorType: "static",
            conjunction: ",",
            static: true,
            defaultDate: '{$dates}',
            onChange: function(selectedDates, dateStr, instance){
                const input = document.getElementById('event_dates');
                if(input){
                        input.value = dateStr;
                }
            }
        });

        const callback = function (mutaionList, observer){
            for (const mutation of mutaionList){
                if(mutation.type === "attributes"){
                    if(mutation.target.classList.contains('open')){
                        const mediaQueryList = window.matchMedia("(max-width: 1080px)");
                        if(mediaQueryList.matches){
                            setMonth(1);
                        }else{
                            setMonth(3);
                        }

                    }
                }
            }
        }

        const observer = new MutationObserver(callback);
        const day = document.getElementById('date-area');

        observer.observe(day,{attributes:true});

        const mediaQueryList = window.matchMedia("(max-width: 1080px)");

        function handleWidthChange(mql){
            if(mql.matches){
                setMonth(1);
            }else{
                setMonth(3);
            }
        }
        handleWidthChange(mediaQueryList);

        mediaQueryList.addEventListener('change', handleWidthChange);

        function setMonth(num = 1){
            const instance = document.getElementById("event-date")._flatpickr;
            if(instance){
                instance.set('showMonths',num);

            }
        }

        const dateClearBtn = document.getElementById('date-clear-btn');
        if(dateClearBtn){
            dateClearBtn.addEventListener('click', function(e){
                e.preventDefault();
                const instance = document.getElementById("event-date")._flatpickr;

                if(instance){
                    instance.clear();
                }

            })
        }
    });
});

JS;
$this->Html->scriptBlock($js, ['block' => 'scriptBody']);
?>

<?php $this->start('pageTitle') ?>
<div class="page-ttl">
    <h1 class="ttl">EVENT<span>イベント</span></h1>
</div>
<?php $this->end(); ?>


<div class="main">
    <!-- inner -->
    <div class="inner">

        <!-- search-block -->
        <div class="search-block">

            <!-- search-btn-sp -->
            <div class="search-btn-sp">
                <!-- filter-block -->
                <div class="filter-block">
                    <div tabindex="0" role="button">絞り込み</div>
                </div>
                <!-- filter-block -->

                <!-- sort-block -->
                <div class="sort-block ac-list">
                    <div>
                        <div class="ac-p" tabindex="0" role="button">並べ替え</div>
                        <div class="ac-c">
                            <?php
                            $queryParams = $this->request->getQueryParams();
                            ?>
                            <?= $this->Html->link('アクセス順', [
                                'action' => 'index',
                                '?' => $queryParams
                            ], ['class' => ($this->request->getParam('action') === "modified" ? '' : 'active')]) ?>
                            <?= $this->Html->link('更新順', [
                                'action' => 'modified',
                                '?' => $queryParams
                            ], ['class' => ($this->request->getParam('action') === "modified" ? 'active' : '')]) ?>
                        </div>
                    </div>
                </div>
                <!-- sort-block -->
            </div>
            <!-- search-btn-sp -->

            <!-- form -->
            <?= $this->Form->create(null, [
                "url" => ["controller" =>  "Events", "action" => $this->request->getParam('action') === "modified" ? "modified" : "index"],
                "type" => "get", "role" => "form", 'valueSources' => 'query', 'id' => 'search-form'
            ]); ?>
            <div class="tab">
                <?php if (Configure::read('CustomSettings.Events.area') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) : ?>
                    <!-- search-label -->
                    <div class="search-label" tabindex="0">エリア</div>
                    <!-- search-label -->
                    <!-- search-item -->
                    <div class="search-item" id="area-area">
                        <!-- form-list -->
                        <fieldset class="form-list ds-legend">
                            <legend>エリア</legend>
                            <span>
                                <input type="checkbox" name="allArea" value="1" id="allArea">
                                <label for="allArea">全てのエリアを選択</label></span>
                            <?=
                            $this->Form->control('areas', [
                                'type' => 'multiCheckbox',
                                'options' => Hash::combine($masterAreas, '{n}.id', '{n}.title'),
                                "label" => false,
                                "hiddenField" => false,
                                'required' => false
                            ]);
                            ?>
                        </fieldset>
                        <!-- form-list -->
                        <!-- btn-block -->
                        <div class="btn-block center to-clear">
                            <!-- btn-base clear-->
                            <p>
                                <a class="btn-base clear" href="#" id="area-clear-btn">検索条件をクリア</a>
                            </p>
                            <!-- btn-base clear -->
                            <!-- button search -->
                            <?= $this->Form->button("この条件で絞り込む", ["type" => "submit", "class" => "btn-base search"]); ?>
                            <!-- button search -->
                        </div>
                        <!-- btn-block -->

                        <!-- btn-close -->
                        <div class="btn-close">閉じる</div>
                        <!-- btn-close -->

                    </div>
                    <!-- search-item -->
                <?php endif; ?>

                <?php if (Configure::read('CustomSettings.Events.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey')) : ?>
                    <!-- search-label -->
                    <div class="search-label" tabindex="0">ジャンル</div>
                    <!-- search-label -->
                    <!-- search-item -->
                    <div class="search-item" id="category-area">
                        <!-- form-list -->
                        <fieldset class="form-list ds-legend">
                            <legend>ジャンル</legend>
                            <span class="genre-search-all">
                                <input type="checkbox" name="allCategory" value="1" id="allCategory">
                                <label for="allCategory">すべてのジャンルを選択</label>
                            </span>
                            <?=
                            $this->Form->control('master_event_categories', [
                                'type' => 'multiCheckbox',
                                'options' => Hash::combine($masterEventCategories, '{n}.id', '{n}.title'),
                                "label" => false,
                                "hiddenField" => false,
                                'required' => false
                            ]);
                            ?>
                        </fieldset>
                        <!-- form-list -->
                        <!-- btn-block -->
                        <div class="btn-block center to-clear">
                            <!-- btn-base clear-->
                            <p>
                                <a class="btn-base clear" href="#" id="category-clear-btn">検索条件をクリア</a>
                            </p>
                            <!-- btn-base clear -->
                            <!-- button search -->
                            <?= $this->Form->button("この条件で絞り込む", ["type" => "submit", "class" => "btn-base search"]); ?>
                            <!-- button search -->
                        </div>
                        <!-- btn-block -->

                        <!-- btn-close -->
                        <div class="btn-close">閉じる</div>
                        <!-- btn-close -->

                    </div>
                    <!-- search-item -->
                <?php endif; ?>

                <!-- search-label -->
                <div class="search-label" tabindex="0">開催日</div>
                <!-- search-label -->
                <!-- search-item -->
                <div class="search-item" id="date-area">
                    <div id="event-date"></div>
                    <?= $this->Form->hidden('event_dates', ['placeholder' => __('開催日を選択'), 'title' => '開催日を選択', 'title' => '開催日を選択', 'id' => 'event_dates']) ?>

                    <!-- btn-block -->
                    <div class="btn-block center to-clear">
                        <!-- btn-base clear-->
                        <p>
                            <a class="btn-base clear" href="#" id="date-clear-btn">検索条件をクリア</a>
                        </p>
                        <!-- btn-base clear -->
                        <!-- button search -->
                        <?= $this->Form->button("この条件で絞り込む", ["type" => "submit", "class" => "btn-base search"]); ?>
                        <!-- button search -->
                    </div>
                    <!-- btn-block -->

                    <!-- btn-close -->
                    <div class="btn-close">閉じる</div>
                    <!-- btn-close -->
                </div>
                <!-- search-item -->
            </div>

            <!-- keyword -->
            <div class="keyword">
                <!-- input -->
                <?= $this->Form->label('q', 'キーワード') ?>
                <?= $this->Form->control("q", ["type" => "text", "placeholder" => 'キーワード', 'label' => false, 'title' => 'キーワード']) ?>
                <!-- input -->
            </div>
            <!-- keyword -->

            <!-- button search -->
            <?= $this->Form->button("検索", ["type" => "submit", "class" => "btn-base search"]); ?>
            <!-- button search -->

            <!-- btn-close -->
            <div class="btn-close" tabindex="0">閉じる</div>
            <!-- btn-close -->

            <?= $this->Form->end() ?>
            <!-- form -->

        </div>
        <!-- search-block -->

        <?php if (
            (Configure::read('CustomSettings.Events.area') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey') &&
                $this->request->getQuery('areas')) ||
            (Configure::read('CustomSettings.Events.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey') &&
                $this->request->getQuery('master_event_categories')) ||
            $this->request->getQuery('event_dates') ||
            $this->request->getQuery('q')
        ) : ?>
            <!-- conditions -->
            <div class="conditions">
                <dl>
                    <dt>検索条件</dt>
                    <dd>
                        <!-- list-conditions -->
                        <ul class="list-conditions">
                            <?php if ($this->request->getQuery('q')) : ?>
                                <?php
                                $query = $this->request->getQueryParams();
                                unset($query['page']);
                                unset($query['q']);
                                $text = $this->request->getQuery('q');
                                if ($text) :
                                ?>
                                    <li>
                                        <?= $this->Html->link("キーワード：" . $text, ['?' => $query]) ?>
                                    </li>
                                <?php endif; ?>
                            <?php endif; ?>
                            <?php if ((Configure::read('CustomSettings.Events.area') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey') &&
                                $this->request->getQuery('areas'))) : ?>
                                <?php
                                $masterAreasArray = Hash::combine($masterAreas, '{n}.id', '{n}');
                                $areas = $this->request->getQuery('areas');
                                foreach ($areas as $k => $v) :
                                    $query = $this->request->getQueryParams();
                                    unset($query['page']);
                                    unset($query['areas'][$k]);
                                    $area = $masterAreasArray[$v] ?? [];
                                    if ($area) :
                                ?>
                                        <li>
                                            <?= $this->Html->link("エリア：" . $area['title'], ['?' => $query], ['class' => $area['class'] ?? "category"]) ?>
                                        </li>
                                    <?php endif; ?>
                                <?php endforeach; ?>
                            <?php endif; ?>
                            <?php if ((Configure::read('CustomSettings.Events.category') !== Configure::read('Site.Settings.CategoryUseTypeKey.noKey') &&
                                $this->request->getQuery('master_event_categories'))) : ?>
                                <?php
                                $masterEventCategoriesArray = Hash::combine($masterEventCategories, '{n}.id', '{n}');
                                $categories = $this->request->getQuery('master_event_categories');
                                foreach ($categories as $k => $v) :
                                    $query = $this->request->getQueryParams();
                                    unset($query['page']);
                                    unset($query['master_event_categories'][$k]);
                                    $category = $masterEventCategoriesArray[$v] ?? "";
                                    if ($category) :
                                ?>
                                        <li>
                                            <?= $this->Html->link($category['title'], ['?' => $query], ['class' => $category['class'] ?? "category"]) ?>
                                        </li>
                                    <?php endif; ?>
                                <?php endforeach; ?>
                            <?php endif; ?>
                            <?php if ($this->request->getQuery('event_dates')) : ?>
                                <?php
                                $query = $this->request->getQueryParams();
                                unset($query['page']);

                                $eventDates = $this->request->getQuery('event_dates');
                                $eventDatesArray = explode(",", $eventDates);
                                foreach ($eventDatesArray as $k => $v) :
                                    $query = $this->request->getQueryParams();
                                    $masterEventDatesArray = explode(",", $query['event_dates']);
                                    unset($query['page']);
                                    unset($masterEventDatesArray[$k]);
                                    $newQuery = implode(',', $masterEventDatesArray);
                                    $query['event_dates'] = $newQuery;
                                    $date = new Chronos($v);
                                    $suf = $this->Utility->getDayOfWeek($date->format('w'));
                                    if ($date) :
                                ?>
                                        <li>
                                            <?= $this->Html->link($date->format('Y年m月d日') . ($suf ? "($suf)" : ""), ['?' => $query]) ?>
                                        </li>
                                    <?php endif; ?>
                                <?php endforeach; ?>

                            <?php endif; ?>
                        </ul>
                        <!-- list-conditions -->
                    </dd>
                </dl>
                <p class="btn-delete">
                    <?= $this->Html->link('条件をクリア', [
                        'action' => $this->request->getParam('action') === "modified" ? "modified" : "index",
                    ]) ?>
                </p>
            </div>
            <!-- conditions -->
        <?php endif; ?>

        <!-- count-disp -->
        <div class="count-disp count-col">

            <!-- paging -->
            <div class="paging ">
                <?= $this->Paginator->counter('range') ?>
            </div>
            <!-- paging -->
            <!-- sort-block -->
            <div class="sort-block ac-list">
                <div>
                    <div class="ac-p" tabindex="0" role="button">並べ替え</div>
                    <div class="ac-c">
                        <?= $this->Html->link('アクセス順', [
                            'action' => 'index',
                            '?' => $queryParams
                        ], ['class' => ($this->request->getParam('action') === "modified" ? '' : 'active')]) ?>
                        <?= $this->Html->link('更新日順', [
                            'action' => 'modified',
                            '?' => $queryParams
                        ], ['class' => ($this->request->getParam('action') === "modified" ? 'active' : '')]) ?>
                    </div>
                </div>
            </div>
            <!-- sort-block -->

        </div>
        <!-- count-disp -->

        <!--list-thumb -->
        <?= $this->cell('Events::pin', []) ?>
        <!-- list-thumb -->

        <?php if ($datas && !$datas->isEmpty()) : ?>
            <!--list-thumb -->
            <ul class="list-thumb col4 sp-col02 ratio-4-3">
                <?php foreach ($datas as $data) : ?>
                    <li>
                        <?= $this->element('Events/item', ['data' => $data]) ?>
                    </li>
                <?php endforeach; ?>
            </ul>
            <!-- list-thumb -->
        <?php endif; ?>

        <!-- count-disp -->
        <div class="count-disp">

            <!-- paging -->
            <div class="paging">
                <div class="pagingIn center">
                    <?= $this->Paginator->prev(__('前のページ')) ?>
                    <?= $this->Paginator->numbers() ?>
                    <?= $this->Paginator->next(__('次のページ')) ?>
                </div>
            </div>
            <!-- paging -->

        </div>
        <!-- count-disp -->

    </div>
    <!-- inner -->

</div>