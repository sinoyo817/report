<?php if (!$data->isEmpty()) : ?>
    <!-- spot-other -->
    <section class="spot-other">

        <!-- inner -->
        <div class="inner">

            <!-- ttl-small -->
            <div class="ttl-small">
                <h3>近くのイベント</h3>
            </div>
            <!-- ttl-small -->
            <?php foreach ($data as $index => $item) : ?>
                <!--list-thumb -->
                <ul class="list-thumb col4 sp-col02 ratio-4-3">
                    <?php foreach ($data as $index => $item) : ?>
                        <li>
                            <?= $this->element('Events/item', ['data' => $item,]) ?>
                        </li>
                    <?php endforeach; ?>

                </ul>
                <!-- list-thumb -->
            <?php endforeach; ?>
        </div>
        <!-- inner -->

    </section>

<?php endif; ?>
