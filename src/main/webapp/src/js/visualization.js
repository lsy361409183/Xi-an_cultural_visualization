define(function(require, exports, module){
    var $ = require('../libs/jquery-3.3.1.min');
    var navTpl = require('../views/templates/navigation.tpl')

    var test = $('#navbar');
    test.html(navTpl);
});