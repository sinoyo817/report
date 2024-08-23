// // // ヘッダーメニュー用js // // //

// header_normalver
// $(function ($) {
//     //メニューの開閉

//     $(".btn-menu > .btn-s").click(function () {
//         $(this).toggleClass("open");
//         $("body").toggleClass("fixed-body");
//         $(".wrap-sp-navi").toggle();
//         $(".wrap-sp-navi").toggleClass("active-sp");
//     });

// });

// header_normalver
// $(window).on('load resize', function () {

//     if ($(window).width() >= 768) {
//         $(".wrap-sp-navi").removeAttr("style");
//     } else if ($(window).width() < 768) {
//     }

// });

// ヘッダー追従 header_normalver
// $(function($) {
//     if (!$("#header").hasClass('no-link')) {
//         $(window).scroll(function () {
//         if($(window).scrollTop() > 200) {
//             $("#header").addClass('fixed-h');
//             if ($(window).width() > 768) {
//                 $("body").css("padding-top","171px");
//             } else if ($(window).width() <= 768) {
//                 $("body").css("padding-top","57px");
//             }
//         } else {
//             $("#header").removeClass('fixed-h');
//             $("body").css("padding-top","0px");
//         }
//         });
//     }
// });


// header,header_megamenu
$(function ($) {
    //メニューの開閉

    $("#header .btn-menu .btn-s").click(function () {
        spMenu();
        btnMenu();
    });

    $('#header .btn-menu .btn-s').keypress(function (e) {
        if (e.keyCode == 13) {
            spMenu();
            btnMenu();
        }
    });

    function spMenu() {
        $("#header .btn-menu .btn-s").toggleClass("open");
        $("body").toggleClass("fixed-body");
        // $(".header-contents").slideToggle();
    };

});

// header,header_megamenu
// $(function ($) {

//     $(".function-block").clone().appendTo("#navi");

// });

// header,header_megamenu
$(window).on('load resize', function () {

    if ($(window).width() > 768) {
        $("#navi, .u-menu ,.wrap-sp-navi").removeAttr("style");
        $(".wrap-sp-navi").removeClass("active-menu")
        $(".wrap-sp-navi").removeClass("active-sp");
        $("body").removeClass("fixed-body");
        $(".btn-menu .btn-s").removeClass("open");
        $("#navi li a.to-lower").removeClass("open-m");
        btnMenu();
    } else if ($(window).width() < 768) {
    }

});

// header_megamenu
$(function ($) {
    $("#navi .u-menu").prev("a").addClass('to-lower');
});

// header_megamenu
$(function ($) {
    $("#navi li a.to-lower").click(function (e) {
        $(this).next(".u-menu").slideToggle();
        $(this).toggleClass("open-m");
        e.preventDefault();
    });
});

//スマホメニューのテキスト表示切り換え
function btnMenu() {
    if ($(".btn-menu .btn-s").hasClass('open')) {
        $(".btn-menu .btn-s").children("p").text("close");
    } else {
        $(".btn-menu .btn-s").children("p").text("menu");
    }
};

// ヘッダー追従　上に上がるとメニュー非表示
$(function ($) {

    var beforePos = 0;//スクロールの値の比較用の設定

    //スクロール途中でヘッダーが消え、上にスクロールすると復活する設定を関数にまとめる
    function ScrollAnime() {

        var scroll = $(window).scrollTop();

        //ヘッダーの出し入れをする
        if (scroll == beforePos) {
            //IE11対策で処理を入れない
        } else if (200 > scroll) {
            $('#header').removeClass('up-h'); //#headerにup-hというクラス名を除き
            $('#header').removeClass('down-h');//#headerにdown-hのクラス名を追加
        }
        else if (0 > scroll - beforePos) {

            //ヘッダーが上から出現する
            $('#header').removeClass('up-h'); //#headerにup-hというクラス名を除き
            $('#header').addClass('down-h');//#headerにdown-hのクラス名を追加
            // $('#navi li').mouseover().addClass('navi-hover');
            $('#navi li a').mouseover().next('.u-menu').removeClass('navi-none');

            num = $('#navi li a').parent('li').index();
            $('#navi li a').mouseover().next('.u-menu').eq(num).addClass('navi-hover');

        } else {

            //ヘッダーが上に消える
            $('#header').removeClass('down-h');//#headerにDownMoveというクラス名を除き
            $('#header').addClass('up-h');//#headerにUpMoveのクラス名を追加
            // $('#navi li a.to-lower').next('.u-menu').slideUp();
            // $('#navi li').mouseover().addClass('navi-hover');
            $('#navi li a').mouseover().next('.u-menu').addClass('navi-none');

        }

        // ヘッダーを固定する
        if (!$("#header").hasClass('no-link')) {
            if (scroll > 0) {
                $("#header").addClass('fixed-h');

                // if ($(window).width() > 768) {
                //     $("body").css("padding-top","160px");
                // } else if ($(window).width() <= 768) {
                //     $("body").css("padding-top","57px");
                // }

            } else {
                $("#header").removeClass('fixed-h');
                $("body").css("padding-top", "0px");
            }

            beforePos = scroll;//現在のスクロール値を比較用のbeforePosに格納
        }

    }

    // スクロールしたタイミングで実行
    $(window).scroll(function () {
        ScrollAnime();
    });

    // ページを読み込んだタイミングで実行
    ScrollAnime();

});

// // // ヘッダーメニュー用js // // //


// アンカーリンク位置調整
$(function () {
    $(window).on('load resize', function () {
        const headerHeight = $("#header").height();
        $("html").css("scroll-padding-top", headerHeight);
        $('#contents a').on('click', function () {
            if ($("#header").hasClass('fixed-h')) {
                $("html").css("scroll-padding-top", 0);
            } else {
                $("html").css("scroll-padding-top", headerHeight);
            }
        });
    });
});

// window.addEventListener('load', setPosition);

// function setPosition() {
//     if (location.hash.indexOf('#') !== -1) {
//         const headerHight = $(window).width() <= 768 ? 57 : 130;
//         const position = $(location.hash).offset().top - headerHight;
//         $('html, body').animate({ scrollTop: position }, 500, 'swing');
//     }
// }

// // // メニュー用js // // //

// サムネイルリスト（追加ボタンあり）
$(function () {

    $('.add-parts .btn-add').on('click', function (e) {
        $(this).toggleClass("on");
        if ($(this).hasClass("on")) {
            $(this).next(".txt-add").text("〇〇〇〇〇削除する");
            var src = $(this).children("img").attr("src").replace('_off.', '_on.');
            $(this).children("img").attr({
                src: src,
                title: '削除する',
                alt: '削除する'
            });
        } else {
            $(this).next(".txt-add").text("〇〇〇〇〇追加する");
            var src = $(this).children("img").attr("src").replace('_on.', '_off.');
            $(this).children("img").attr({
                src: src,
                title: '追加する',
                alt: '追加する'
            });
        }
        e.preventDefault();
    });

    $('.add-parts .btn-add').keypress(function (e) {
        if (e.keyCode == 13) {
            $(this).toggleClass("on");
            if ($(this).hasClass("on")) {
                $(this).next(".txt-add").text("〇〇〇〇〇削除する");
                var src = $(this).children("img").attr("src").replace('_off.', '_on.');
                $(this).children("img").attr({
                    src: src,
                    title: '削除する',
                    alt: '削除する'
                });
            } else {
                $(this).next(".txt-add").text("〇〇〇〇〇追加する");
                var src = $(this).children("img").attr("src").replace('_on.', '_off.');
                $(this).children("img").attr({
                    src: src,
                    title: '追加する',
                    alt: '追加する'
                });
            }
            e.preventDefault();
        }
    });

});

$(function () {

    $('.fav-part .active').hide();
    $('.fav-part button').click(function (e) {
        $(this).hide();
        $(this).siblings().show();
        e.preventDefault();
    });

    $('.fav-part button').keypress(function (e) {
        if (e.keyCode == 13) {
            $(this).hide();
            $(this).siblings().show();
            e.preventDefault();
            e.preventDefault();
        }
    });

});


// 多言語プルダウン
$(function ($) {
    $(".btn-lang-pulldown dt").click(function (e) {
        $(this).next("dd").slideToggle();
    });
});

// 多言語プルダウンフォーカスアウトで非表示
$(function ($) {

    $('.btn-lang-pulldown dd ul li:last-child a')
        .focusin(function (e) {
        })
        .focusout(function (e) {
            $(".btn-lang-pulldown dt").next("dd").slideUp();
        });

});

// 検索窓アコーディオン
$(function () {
    //アコーディオンjs
    $('.search-conditions.toggle .btn-toggle').click(function (e) {
        $(this).next("div").slideToggle();
        $(this).toggleClass("open-search");
    });
});

$('.search-conditions.toggle .btn-toggle').keypress(function (e) {
    if (e.keyCode == 13) {
        $(this).next("div").slideToggle();
        $(this).toggleClass("open-search");
    }
});

// よくある質問
$(function () {

    $('.list-qa > .col-qa > div').hide();
    $('.list-qa > .col-qa > .col-qa-ttl').click(function (e) {
        $(this).next("div").slideToggle();
        $(this).toggleClass("active");
    });

    $('.list-qa > .col-qa > .col-qa-ttl').keypress(function (e) {
        if (e.keyCode == 13) {
            $(this).next("div").slideToggle();
            $(this).toggleClass("active");
        }
    });

});

//backnumber
$(window).on('load', function () {

    if ($(window).width() < 768) {
        $(".back-number .back-number-ttl").click(function () {
            $(this).next(".list-year").slideToggle();
            $(this).toggleClass("active");
        });
    }

});


//上下のスクロールバー連動
$(function () {

    $(window).on('load resize', function () {

        $('.table-scroll').each(function (i) {
            $(this).addClass("table-block" + (i + 1));

            // テーブルの幅を取得し、#scrollbar .scroll_innerにwidthを指定
            var widthTable = $(this).find(".scroll-table table.table-data").outerWidth();
            var widthScrollTable = $(this).find(".scroll-table").outerWidth();
            $(this).find(".scroll-bar .scroll-in").width(widthTable);

            // 上下のスクロールバーが連動するよう調整
            $(this).find(".scroll-bar, .scroll-table").on("scroll", function () {
                $(this).find(".pct-scrollhint").fadeOut();
                if ($(this).attr("class") === "scroll-bar") {
                    $(this).next(".scroll-table").scrollLeft($(this).scrollLeft());
                } else {
                    $(this).scrollLeft($(this).scrollLeft());
                    $(this).parents(".table-scroll").children(".scroll-bar").scrollLeft($(this).scrollLeft());
                }
            });

            // スクロールバーが出るときだけ、scrollhintを表示
            if (widthScrollTable < widthTable - 1) {
                $(this).find(".pct-scrollhint").addClass("active");
            } else {
                $(this).find(".pct-scrollhint").removeClass("active");
            }

        });
    });

});

// sp,pc画像切り替え用js
$(function () {

    // 切り替える対象にclass属性。
    var $elem = $('.img-c');
    // 切り替えの対象のsrc属性の末尾の文字列。
    var sp = '_sp.';
    var pc = '_pc.';
    // 画像を切り替えるウィンドウサイズ。
    var replaceWidth = 768;

    function imageSwitch() {
        // ウィンドウサイズを取得する。
        var windowWidth = parseInt($(window).width());

        // ページ内にあるすべての`.switch`に適応される。
        $elem.each(function () {
            var $this = $(this);
            if (windowWidth >= replaceWidth) {
                $this.attr('src', $this.attr('src').replace(sp, pc));
            } else {
                $this.attr('src', $this.attr('src').replace(pc, sp));
            }
        });
    }
    imageSwitch();

    // 動的なリサイズは操作後0.2秒経ってから処理を実行する。
    var resizeTimer;
    $(window).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            imageSwitch();
        }, 200);
    });

});

$(function () {

    // btn-check
    $(function () {
        $(".btn-check input").focus(focusFunc);
        function focusFunc(e) {
            $(this).next('.btn-check label').css('outline', '1px solid #000');
        }

        $(".btn-check input").focusout(focusoutFunc);
        function focusoutFunc(e) {
            $(this).next('.btn-check label').css('outline', 'none');
        }
    });

    // btn-icon
    $(function () {
        $(".btn-icon input").focus(focusFunc);
        function focusFunc(e) {
            $(this).next('.btn-icon label').css('outline', '1px solid #000');
        }

        $(".btn-icon input").focusout(focusoutFunc);
        function focusoutFunc(e) {
            $(this).next('.btn-icon label').css('outline', 'none');
        }
    });
});

//page-top
$(function () {
    var topBtn = $('.page-top');
    topBtn.hide();
    //消える
    $(window).scroll(function () {
        if ($(this).scrollTop() > 10) {
            topBtn.fadeIn();
        } else {
            topBtn.fadeOut();
        }
    });
});

// // // アクセシビリティ対応用js // // //

//idとaria-controls,accordion-panelに番号を割り振る
$('.ac-p').each(function (i) {
    $(this).attr({
        id: 'accordion-tab' + (i + 1),
        'aria-controls': 'accordion-panel' + (i + 1)
    });
    $(this).next('.ac-c').attr({
        'aria-labelledby': 'accordion-tab' + (i + 1),
        id: 'accordion-panel' + (i + 1)
    });
});

//それぞれにrole属性、aria-expanded、aria-hiddenを付ける
$('.ac-list').attr('role', 'tablist');
$('.ac-list .ac-c').attr('role', 'tabpanel');
$('.ac-p').attr({
    role: 'tab',
    'aria-expanded': 'false',
});
// $('.ac-c').attr('aria-hidden', 'true');

//クリックした際のrole属性、aria-expanded、aria-hiddenを変更する
$(".ac-p").click(function (e) {
    if (!$(".ac-p").hasClass('active')) {
        $(this).attr({
            'aria-expanded': 'true'
        });
        $(this).next(".ac-c").attr({
            'aria-hidden': 'false'
        });
    } else {
        $(this).attr({
            'aria-expanded': 'false'
        });
        $(this).next(".ac-c").attr({
            'aria-hidden': 'true'
        });
    }
    //aタグ無効化
    e.preventDefault();
});

//初期表示
$('.ac-c').css("display", "none");



////////// SPの時だけaria-labelを付ける //////////
//idとaria-controls,accordion-panelに番号を割り振る
$(function () {

    if ($(window).width() < 768) {
        $('.sp-ac-p').each(function (i) {
            $(this).attr({
                id: 'accordion-tab' + (i + 1),
                'aria-controls': 'accordion-panel' + (i + 1)
            });
            $(this).next('.sp-ac-c').attr({
                'aria-labelledby': 'accordion-tab' + (i + 1),
                id: 'accordion-panel' + (i + 1)
            });
        });

        //それぞれにrole属性、aria-selected、aria-expanded、aria-hiddenを付ける
        $('.sp-ac-list').attr('role', 'tablist');
        $('.sp-ac-list .sp-ac-c').attr('role', 'tabpanel');
        $('.sp-ac-p').attr({
            role: 'tab',
            'aria-selected': 'false',
            'aria-expanded': 'false',
        });
        $('.sp-ac-c').attr('aria-hidden', 'true');

        //クリックした際のrole属性、aria-selected、aria-expanded、aria-hiddenを変更する
        $(".sp-ac-p").click(function (e) {
            if (!$(".sp-ac-p").hasClass('active')) {
                $(this).attr({
                    'aria-selected': 'true',
                    'aria-expanded': 'true'
                });
                $(this).next(".sp-ac-c").attr({
                    'aria-hidden': 'false'
                });
            } else {
                $(this).attr({
                    'aria-selected': 'false',
                    'aria-expanded': 'false'
                });
                $(this).next(".sp-ac-c").attr({
                    'aria-hidden': 'true'
                });
            }
            //aタグ無効化
            e.preventDefault();
        });

        //初期表示
        $('.sp-ac-c').css("display", "none");
    }
});


// スマホメニュー

//idとaria-controls,accordion-panelに番号を割り振る
$('.sp-p').attr({
    id: 'menu-tab1',
    'aria-controls': 'menu-panel1'
});
$('.sp-c').attr({
    'aria-labelledby': 'menu-tab1',
    id: 'menu-panel1'
});
// $('.sp-c').addClass("active-menu");

//それぞれにrole属性、aria-selected、aria-expanded、aria-hiddenを付ける
$('.sp-p').attr({
    'aria-selected': 'false',
    'aria-expanded': 'false',
});
$('.sp-c').attr('aria-hidden', 'true');

//クリックした際のrole属性、aria-selected、aria-expanded、aria-hiddenを変更する
$(".sp-p").click(function (e) {

    $('.sp-c').toggleClass("active-menu");

    if ($(".sp-c").hasClass('active-menu')) {
        $(this).attr({
            'aria-selected': 'true',
            'aria-expanded': 'true'
        });
        $(".sp-c").attr({
            'aria-hidden': 'false'
        });
    } else {
        $(this).attr({
            'aria-selected': 'false',
            'aria-expanded': 'false'
        });

        $(".sp-c").attr({
            'aria-hidden': 'true'
        });
    }

    //aタグ無効化
    e.preventDefault();

});


// tab
$('ul.tab-area li a').click(function (e) {
    num = $(this).parent('li').index();
    $(this).addClass('active').parent().siblings().children().removeClass('active');
    $(this).parent().parent().parent().next('.tab-contents').children('div').removeClass('active').eq(num).addClass('active');
    e.preventDefault();
});


// サイドボタン（シェアボタン）
$(window).on('load resize', function () {

    if ($(window).width() >= 768) {

        if ($("section").hasClass('spot-main')) {

            $('.side-btn').css({'position':'fixed', 'bottom': '5%'});
            $(window).scroll(function(){

                    //スクロールするオブジェクトの高さ
                    var boxhight = $('.side-btn').outerHeight();
                    //追従開始位置
                    var toplimit =  $('.spot-main').offset().top;
                    //追従終了位置(最後の数値64はボタンのmargin分)
                    var bottomimit =  $('.spot-other').offset().top - (boxhight * 2) - 64;


                    if($(window).scrollTop() > toplimit){
                        $('.side-btn').css({'position':'fixed', 'bottom': '5%'});
                        if($(window).scrollTop() > bottomimit){
                            $('.side-btn').css({'position':'absolute', 'bottom': '0'});
                        }
                    }else{
                        $('.side-btn').css({'position':'fixed', 'bottom': '5%'});
                    }
            });
        }
    }
});


// サイドボタン（保存ボタン）
$(function () {

    $('.btn-bookmark').on('click', function (e) {
        $(this).toggleClass("on");
        if ($(this).hasClass("on")) {
            var src = $(this).children("img").attr("src").replace('_off.', '_on.');
            $(this).children("img").attr({
                src: src,
            });
            $(this).attr({
                'aria-pressed': 'true',
            });
        } else {
            var src = $(this).children("img").attr("src").replace('_on.', '_off.');
            $(this).children("img").attr({
                src: src,
            });
            $(this).attr({
                'aria-pressed': 'false',
            });
        }
        e.preventDefault();
    });

});

// 並べ替えボタン
$(function () {
    $('.sort-block .ac-p').on('click', function (e) {
        $(this).next(".ac-c").slideToggle();
        $(this).toggleClass("active");
    });

    $('.sort-block .ac-p').keypress(function (e) {
        if (e.keyCode == 13) {
            $(this).next(".ac-c").slideToggle();
            $(this).toggleClass("active");
        }
    })

});
