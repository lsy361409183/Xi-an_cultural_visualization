define(function(require, exports, module){
    var $ = require('../libs/jquery-3.3.1.min');
    console.log('$',$)
    var navTpl = require('../views/templates/navigation.tpl')
    console.log(navTpl);
    // var test = document.getElementById('#navbar');
    var test = $('#navbar');
    test.html(navTpl);
    console.log(test);
})