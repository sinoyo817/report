<?php

declare(strict_types=1);

use Cake\Core\Configure;
use Cake\I18n\FrozenDate;

/**
 * @var \App\View\AppView $this
 * @var \Cake\I18n\FrozenDate $published
 */

?>


<!-- header -->
<header id="header">

    <!-- btn-skip -->
    <div class="btn-skip"><a href="#contents">本文へ</a></div>
    <!-- btn-skip -->

    <!-- header-wrap -->
    <div class="header-wrap">
        <?php if (isset($isTop) && $isTop) : ?>
            <h1 class="logo-h">
                <a href="/"><img src="/img/common/logo.svg" width="160" alt="QTmedia"></a>
            </h1>
        <?php else : ?>
            <!-- logo-h -->
            <div class="logo-h">
                <a href="/"><img src="/img/common/logo.svg" width="160" alt="QTmedia"></a>
            </div>
            <!-- logo-h -->
        <?php endif; ?>

        <!-- btn-menu -->
        <div class="btn-menu">
            <div tabindex="0" role="button" class="btn-s sp-p">
                <div>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <p>menu</p>
            </div>
        </div>
        <!-- btn-menu -->

        <div class="header-contents">
            <!-- navi -->
            <nav id="navi">
                <ul class="gnavi sp-c">
                    <li><a href="">お知らせ（画像付きナビ）</a>
                        <div class="u-menu">
                            <ul>
                                <li class="no-arrow">
                                    <a href="">
                                        <figure>
                                            <img src="/img/common/noimage.jpg" alt="">
                                        </figure>
                                        テキストが入ります
                                    </a>
                                </li>
                                <li class="no-arrow">
                                    <a href="">
                                        <figure>
                                            <img src="/img/common/noimage.jpg" alt="">
                                        </figure>
                                        テキストが入ります
                                    </a>
                                </li>
                                <li class="no-arrow">
                                    <a href="">
                                        <figure>
                                            <img src="/img/common/noimage.jpg" alt="">
                                        </figure>
                                        テキストが入ります
                                    </a>
                                </li>
                                <li class="no-arrow">
                                    <a href="">
                                        <figure>
                                            <img src="/img/common/noimage.jpg" alt="">
                                        </figure>
                                        テキストが入ります
                                    </a>
                                </li>
                                <li class="no-arrow">
                                    <a href="">
                                        <figure>
                                            <img src="/img/common/noimage.jpg" alt="">
                                        </figure>
                                        テキストが入ります
                                    </a>
                                </li>
                                <li class="no-arrow">
                                    <a href="">
                                        <figure>
                                            <img src="/img/common/noimage.jpg" alt="">
                                        </figure>
                                        テキストが入ります
                                    </a>
                                </li>

                            </ul>
                        </div>
                    </li>
                    <li><a href="">お知らせ（リストのナビ）</a>
                        <div class="u-menu">
                            <ul>
                                <li><a href="">全て</a></li>
                                <li><a href="">イベントイベントイベントイベントイベント</a></li>
                                <li><a href="">トピックストピックストピックストピックストピックス</a></li>
                                <li><a href="">全て</a></li>
                                <li><a href="">イベントイベントイベントイベントイベント</a></li>
                                <li><a href="">全て</a></li>
                                <li><a href="">イベントイベントイベントイベントイベント</a></li>
                                <li><a href="">トピックストピックストピックストピックストピックス</a></li>
                            </ul>
                        </div>
                    </li>
                    <li><a href="/topics">お知らせ</a></li>
                    <li><a href="/events">イベント</a></li>
                    <li><a href="">ギャラリー</a></li>
                    <li><a href="/faq/">よくある質問</a></li>
                </ul>
            </nav>
            <!-- navi -->

            <!-- function-block -->
            <div class="function-block">

                <!-- 多言語ボタン並列 btn-lang -->
                <!-- <ul class="btn-lang">
					<li><a href="">日本語</a></li>
					<li><a href="">English</a></li>
					<li><a href="">한국어</a></li>
					<li><a href="">簡体中文</a></li>
					<li><a href="">繁体中文</a></li>
				</ul> -->
                <!-- 多言語ボタン並列 btn-lang -->

                <!-- 多言語ボタンアコーディオン btn-lang-pulldown -->
                <dl class="btn-lang-pulldown">
                    <dt><button>多言語切り替え</button></dt>
                    <dd>
                        <ul class="btn-lang">
                            <li><a href="">日本語</a></li>
                            <li><a href="">English</a></li>
                            <li><a href="">한국어</a></li>
                            <li><a href="">簡体中文</a></li>
                            <li><a href="">繁体中文</a></li>
                        </ul>
                    </dd>
                </dl>
                <!-- 多言語ボタンアコーディオン btn-lang -->

                <!-- list-sns -->
                <ul class="list-sns">
                    <li class="icon-facebook"><a href=""><img title="facebook" src="/img/common/ico_facebook.svg" alt="facebook"></a></li>
                    <li class="icon-insta"><a href=""><img title="インスタグラム" src="/img/common/ico_insta.svg" alt="インスタグラム"></a></li>
                    <li class="icon-twitter"><a href=""><img title="twitter" src="/img/common/ico_twitter.svg" alt="twitter"></a></li>
                    <li class="icon-line"><a href=""><img title="line" src="/img/common/ico_line.svg" alt="line"></a></li>
                </ul>
                <!-- list-sns -->

                <!-- btn-search -->
                <div class="btn-search">
                    <form>
                        <fieldset>
                            <legend>サイト内検索</legend>
                            <input name="data[Search][keywords]" type="text" placeholder="サイト内検索" class="text" title="キーワード検索" value="" id="SearchKeywords-h"><button>検索</button>
                        </fieldset>
                    </form>
                </div>
                <!-- btn-search -->

            </div>
            <!-- function-block -->
        </div>

    </div>
    <!-- header-wrap -->

</header>
<!-- header -->
