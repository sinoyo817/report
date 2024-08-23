<?php if (!$data->isEmpty()) : ?>
    <!-- event-area-top -->
    <section id="event" class="event-area-top">

        <!-- inner -->
        <div class="inner">

            <h2 class="ttl-top">EVENT<span>イベント</span></h2>

            <!-- list-ph -->
            <ul class="list-thumb col4 sp-col01">
                <?php foreach ($data as $index => $item) : ?>
                    <li>
                        <?= $this->element('Events/item', ['data' => $item,]) ?>
                    </li>
                <?php endforeach; ?>


            </ul>
            <!-- list-ph -->

            <!-- btn-block -->
            <div class="btn-block center">

                <!-- btn-base arrrow-->
                <p class="btn-base arrow border">
                    <?= $this->Html->link('イベント一覧へ', ['controller' => 'Events', 'action' => 'index']) ?>
                </p>
                <!-- btn-base arrow-->

            </div>
            <!-- btn-block -->

        </div>
        <!-- inner -->

    </section>
    <!-- event-area-top -->
<?php endif; ?>
