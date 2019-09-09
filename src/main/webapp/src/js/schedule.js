define(function(require, exports, module) {
    // var $ = require('../libs/jquery-3.3.1.min');

    // 加载导航模板
    var navTpl = require('../views/templates/navigation.tpl')
    var nav_container = $('#nav-tpl');
    nav_container.html(navTpl);
    //画表,画表是单独的
    var container = document.getElementById('table');
    var hot = new Handsontable(container, {
        data: [],
        colHeaders: ['区域', '地块编号', '编号', '名称', '区位', '规模', '建成年代', '平面形态', '文地分类', '依据', '文保单位', '备注'],
        columns: [
            //表头与对应列的关系
            {data: 'baseDistrict'},
            {data: 'baseDistrictId'},
            {data: 'baseId'},
            {data: 'baseName'},
            {data: 'baseRegion'},
            {data: 'baseArea'},
            {data: 'baseDate'},
            {data: 'basePlaneform'},
            {data: 'baseClassification'},
            {data: 'baseBasis'},
            {data: 'baseUnit'},
            {data: 'baseRemarks'},
        ],
        rowHeaders: false,
        width: 750,
        minRows: 20,
        minCols: 12,
        colWidths: ['55', '65', '45', '85', '65', '45', '60', '70', '70', '70', '60', '50'],//x轴上的每行的距离
        rowWidths: 65,
        contextMenu: true,
        manualRowResize: true,
        manualColumnResize: true,
    });

    var total = 0;
    //渲染，把数据加载进表，需要通过分页插件获取鼠标点击选取的页码
    // cur是插件函数传过来的当前页码
        function render(page){
            $.ajax({
                url: '/select',
                type: 'get',
                async: false,
                dataType: 'json',
                data: {
                    page: page,
                    baseDistrict:"全部",
                    baseClassification: "全部",
                    //这个page需要是分页按钮的page
                },
                success: function (res) {
                    //加载表格数据
                    hot.loadData(res.list)
                    total = res.pages;
                }
            })
        }
//第一次渲染时的当前页码
    render(1)
//bootstrap的分页插件，单独取鼠标选取的页码，传给render()
        $('#pageUl').bootstrapPaginator({//将id为pageLimit的ul元素设置为分页插件
            // currentPage: bpPage,//设置当前页码，没有用到
            size: "small",//设置控件的显示大小，
            bootstrapMajorVersion: 3,//当前版本
            alignment: "right",//设置控件的对齐方式
            totalPages: total ,//设置总页数.
            itemTexts: function (type, page, current) {//控制每个操作按钮的显示文字。是个函数，有3个参数: type, page, current。
                //通过这个参数我们就可以将操作按钮上的英文改为中文，如first-->首页，last-->尾页。
                switch (type) {
                    case "first": return "首页";
                    case "prev": return "<";
                    case "next": return ">";
                    case "last": return "末页";
                    case "page": return page;
                }
            },
            onPageClicked: function (event, originalEvent, type, page) {//为操作按钮绑定click事件。
                // console.log('page', page)
                //回调函数的参数：event, originalEvent, type,page。
               //将page参数传给渲染函数
               // 单选框的选择都是全部的时候==没有点击单选框，且运算
                if ( ($('.select1 option:selected').val())&&($('.select2 option:selected').val() )=='全部'){
                    render(page)
                }else{
                    getOptionData(page)
                }
            }
        });
//请求单选框数据
    function getOptionData(area,type,page){
        $.ajax({
            type:'get',
            url:'/region',
            async:'false',
            dataType:'json',
            data:{
                baseDistrict:area,
                baseClassification: type,
                page:page
            },
            success:function (res) {
                hot.loadData(res.list)
                total = res.pages;
            }
        })
    }
    getOptionData("全部", "全部",'1');
    $('.buzhidao').change(function () {
        var area=$('.select1 option:selected').val();
        var type=$('.select2 option:selected').val();
        var page=1
        console.log(area)
        console.log(type)
        getOptionData(area,type,page)
    })



})