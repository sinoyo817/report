
            
            <div class="paging">
                <?= $this->Paginator->counter('range') ?>
                <div class="pagingIn">
                    <?= $this->Paginator->prev(__('前のページ')) ?>
                    <?= $this->Paginator->numbers() ?>
                    <?= $this->Paginator->next(__('次のページ')) ?>
                </div>
            </div>