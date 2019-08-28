define(function (require, exports, module) {
    console.log(module)
    var $ = require('jquery');
    var style = require('css/index.css');
    var resetCss = require('css/reset.css');
    console.log($('#testDiv'))
    function setHeight(){
        // 获取浏览器高度，设置首页的高度，来一屏展示
        var clientHeight = $(window).height();
        var body_warp = $(".index_body_warp"),
            dom_slide_page = $('.slide_page_content'),
            dom_box_left = $('.box_left'),
            dom_box_right = $('.box_right');
        body_warp.css("height", clientHeight + "px");
        dom_slide_page.css("height", clientHeight - 250 + "px");
        dom_box_left.css("top", (clientHeight - 700)/2 + "px");
        dom_box_right.css("top", (clientHeight - 500)/2 + "px")
        console.log("slide_page_content",dom_slide_page)
    }
    setHeight();

    $(window).resize(function(){
        setHeight();
    })
})