<?php if (!$data->isEmpty()) : ?>

    <ul class="list-thumb col3 sp-col01 ratio-4-3">
        <?php foreach ($data as $index => $item) : ?>
            <li>
                <?= $this->element('Events/item', ['data' => $item,]) ?>
            </li>
        <?php endforeach; ?>
    </ul>

<?php endif; ?>
