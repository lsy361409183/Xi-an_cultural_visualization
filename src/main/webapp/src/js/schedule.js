define(function(require, exports, module) {
    // var $ = require('../libs/jquery-3.3.1.min');

    // 加载导航模板
    var navTpl = require('../views/templates/navigation.tpl')
    var nav_container = $('#nav-tpl');
    nav_container.html(navTpl);
console.log(111)
    //画表
    var hot,
        objectData = [
        {baseDistrict:'未央区',baseDistrictId:'E-1',baseId:1,baseName:'西安文景公园',baseRegion:'西安市文景北路',baseArea:51.8,
            baseDate:2003,basePlaneform:'不规则形', baseClassification:'四类文地',baseBasis:'西汉王夫人墓',baseUnit:'西安市政府',
            baseRemarks:'',}
        ],
        container = document.getElementById('table');

    hot = new Handsontable(container, {
        data: objectData,
        colHeaders: ['区域','地块编号','编号','名称','区位','规模','建成年代','平面形态','文地分类','依据','文保单位','备注'],
        columns: [
            //表头与对应列的关系
            {data:'baseDistrict'},
            {data:'baseDistrictId'},
            {data: 'baseId'},
            {data:'baseName'},
            {data:'baseRegion'},
            {data:'baseArea'},
            {data:'baseDate'},
            {data:'basePlaneform'},
            {data:'baseClassification'},
            {data:'baseBasis'},
            {data:'baseUnit'},
            {data:'baseRemarks'},
        ],
        rowHeaders: false,
        width:1000,
        minRows:20,
        minCols:12,
        colWidths:['55','65','45','85','65','45','60','70','70','70','60','50'],//x轴上的每行的距离
        rowWidths:65,
        contextMenu: true,
        manualRowResize : true,
        manualColumnResize : true,
    });

    // 获取表格数据
    getData(function () {
        $.ajax({
            url:'',
            type:'get',
            dataType:'json',
            // data:JSON.stringify(Data),
            success:function () {
                console.log(data)
                loadData(data)
            }
        })
    })

    //分页
    //首页
    $("#FirstPage").click(function () {
        href += "&page=" + 1;
        window.location.href = (window.location.href.indexOf("&") > 0 ? window.location.href.substr(0, window.location.href.indexOf("&")) : window.location.href) + href;
    });
//尾页
    $("#LastPage").click(function () {
        href += "&page=" + parseInt($("#AllPage").text());
        window.location.href = (window.location.href.indexOf("&") > 0 ? window.location.href.substr(0, window.location.href.indexOf("&")) : window.location.href) + href;
    });
//上一页
    $("#UpPage").click(function () {
        if (parseInt($("#CurrentPage").text()) != 1) {
            href += "&page=" + (parseInt($("#CurrentPage").text()) - 1);
            window.location.href = (window.location.href.indexOf("&") > 0 ? window.location.href.substr(0, window.location.href.indexOf("&")) : window.location.href) + href;
        }
    });
//下一页
    $("#DownPage").click(function () {
        if (parseInt($("#CurrentPage").text()) != parseInt($("#AllPage").text())) {
            href += "&page=" + (parseInt($("#CurrentPage").text()) + 1);
            window.location.href = (window.location.href.indexOf("&") > 0 ? window.location.href.substr(0, window.location.href.indexOf("&")) : window.location.href) + href;
        }
    });
//跳转
    $("#lnkGoto").click(function () {
        if (parseInt($("#txtNeedPage").val().trim()) > 0 && parseInt($("#txtNeedPage").val().trim()) <= parseInt($("#AllPage").text())) {
            href += "&page=" + parseInt($("#txtNeedPage").val().trim());
            window.location.href = (window.location.href.indexOf("&") > 0 ? window.location.href.substr(0, window.location.href.indexOf("&")) : window.location.href) + href;
        }
    });
//跳转后要重新画表的代码么？?
    // var container = document.querySelector('#deallist');
//     hot = new newHandsontable(container, {
//         // colHeaders:@Html.Raw(Model.Headers ==null?"[]":Model.Headers),
//         data:objectData,
//         cells: function (row, col, prop) {
//         var cellProperties = {};
//         cellProperties.renderer = "negativeValueRenderer";
//         return cellProperties;
//     }
// });
})