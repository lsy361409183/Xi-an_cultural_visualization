define(function(require, exports, module){
    // var $ = require('../libs/jquery-3.3.1.min');

    // 加载导航模板
    var navTpl = require('../views/templates/navigation.tpl');
    var nav_container = $('#nav-tpl');
    nav_container.html(navTpl);

    function setMapHeight() {
        var clientHeight = $(window).height();

        // 获取导航高度
        var nav_height = $('#nav-tpl').height();

        var map_container = $('#container');
        var square = $('#square');
        square.css("height",(clientHeight - nav_height)+'px');
        map_container.css('height', (clientHeight - nav_height)+'px');
    }
    setMapHeight();
    // 浏览器高度变化时
    $(window).resize(function () {
        setMapHeight();
    });


});
