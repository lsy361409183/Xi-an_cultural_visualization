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
        exportFile: true,
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

    var button = document.getElementById('export-file');
    // console.log('exportPlugin', hot.getPlugin)
    button.addEventListener('click', function() {
        hot.getPlugin('exportFile').downloadFile('csv', {
            filename: '西安文地',
        });
    });


    var total = 0;
    //渲染，把数据加载进表，需要通过分页插件获取鼠标点击选取的页码
    // cur是插件函数传过来的当前页码
        function render(area,type,page,poiText){
            $.ajax({
                url: '/region',
                type: 'get',
                async: false,
                dataType: 'json',
                data: {
                    page: page,
                    //区域传数
                    baseDistrict:"\'" + area + "\'",
                    //类别传数
                    baseClassification: "\'" + type + "\'",
                    fuzzyName:"\'" + poiText + "\'",

                },
                success: function (res) {
                    //加载表格数据
                    hot.loadData(res.list)
                    total = res.pages;

                }
            })
            $('#pageUl').bootstrapPaginator({//将id为pageLimit的ul元素设置为分页插件
                currentPage: page,//设置当前页码，没有用到
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
            })
        }
//第一次渲染时的当前页码
    render("全部", "全部",'1', "")
//bootstrap的分页插件，单独取鼠标选取的页码，传给render()
        $('#pageUl').bootstrapPaginator({//将id为pageLimit的ul元素设置为分页插件
            onPageClicked: function (event, originalEvent, type, page) {//为操作按钮绑定click事件。
                page:page;
                var a=$('.select1 option:selected').val();
              var b=$('.select2 option:selected').val();
                var c= $('#poiText').val()
                    render(a,b,page,c)
            }
        });
    //取区域类别
    $('.singleBox').change(function () {
        var area=$('.select1 option:selected').val();
        var type=$('.select2 option:selected').val();
        var page=1;
        var poiText= $('#poiText').val()
        render(area,type,page,poiText)
    })
    //模糊查询
    $('#poiSelect').on('click',function () {
        var poiText= $('#poiText').val();
        var page=1;
        var area= $('.select1 option:selected').val();
        var type=$('.select2 option:selected').val();
        console.log(poiText)
        // if (!(poiText == null||poiText == ""||poiText == undefined))
        // //模糊查询框不是空
        // {
        //     // $('#areas-select-title').attr("color",'22ee00');
        //     $('.area-districts').prop("disabled",true);
        //     $('.areas-types').prop("disabled",true);
        //     area= "全部";
        //     type="全部";
        //     console.log(area)
        // }
        // else
        // {
        //     $('.area-districts').prop("disabled",false);
        //     $('.areas-types').prop("disabled",false);
        //
        // }
        render(area,type,page,poiText)
    })
//    切换图片和高德地图标记
    $("#table td").on('click',function (){
        //取点击行的名称
        var x = $(this).parent().find("td").eq(2).text()
        console.log(x)
        $("#imgID").attr('src','');

        // $.ajax({
        //     url:'',
        //     type:'get',
        //     async:false,
        //     dataType: 'json',
        //     data:{
        //         baseName:x
        //     },
        //     success:function (data) {
        //     //    更换图片和坐标点
        //       $("#imgID").attr('src','data.path')
        //
        //
        //
        //     }
        // })

    })

})