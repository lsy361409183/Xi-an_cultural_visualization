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
        colHeaders: ['区域', '编号', '名称', '区位', '规模', '建成年代', '平面形态', '文地分类', '依据', '文保单位', '备注'],
        columns: [
            //表头与对应列的关系
            {data: 'baseDistrict'},
            // {data: 'baseDistrictId'},
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
        width: 1150,
        minRows: 40,
        minCols: 11,
        // colWidths: ['65', '84', '65', '65', '65', '65', '84', '84', '84', '65', '84', '65'],//x轴上的每行的距离
        rowWidths: 75,
        contextMenu: true,
        manualRowResize: true,
        manualColumnResize: true,
    });

    var button = document.getElementById('export-file');
    button.addEventListener('click', function() {
        hot.getPlugin('exportFile').downloadFile('csv', {
            filename: '西安文地一览表',
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
        render(area,type,page,poiText)
    })
//    切换图片和高德地图标记
    //地图
    var map = new AMap.Map('gaodemap', {
        resizeEnable: true,
        center: [108.931711,34.277604],//西安坐标
        zoom: 11
    });

    $("#table td").on('click',function (){
        //取点击行的名称
        var x = $(this).parent().find("td").eq(1).text()
        console.log(x)
        $.ajax({
            url:'/click',
            type:'get',
            async:false,
            dataType: 'json',
            data:{
                baseId:x
            },
            success:function (e) {
            //    更换图片和坐标点
                console.log(e);
                var path=e[0].basePicture;
              $("#imgID").attr('src',path)
                map.clearMap();
                var markers = [];
                var infoWindow;
                var marker;
                var position=e[0].baseLatandlon;
                //string转obj
                var obj = eval("(" + position + ")");
                    marker = new AMap.Marker({
                        position:obj,
                        zIndex: 101,
                        map:map
                    });
                var baseName;
                var baseClassification;
                var baseArea;
                map.add(marker);
                marker.setMap(map);

                marker.baseName=e[0].baseName;
                marker.baseClassification=e[0].baseClassification;
                marker.baseArea=e[0].baseArea;
                marker.on('click', function(e){
                        infoWindow.setContent(
                            "</br>"+"<div id='info-content'>" + "<ul class='main'>" +
                            "<li > 文地名称:<span style='color:#222222'>"+e.target.baseName+"</span></li>"
                            + "<li>  文地类别: <span style='color:#222222'>"+e.target.baseClassification+"  </span></li>"
                            + "<li>  文地面积: <span style='color:#222222'>"+e.target.baseArea+" </span></li>"
                            + "</ul></div>");
                        infoWindow.open(map, e.lnglat);
                    });
                    // for-end
                infoWindow = new AMap.InfoWindow({
                    anchor: 'center',
                    isCustom:	true,
                    closeWhenClickMap:true,
                    draggable: true,  //是否可拖动
                    offset: new AMap.Pixel(0, -31),
                    content:""
                });
            }
    })
    })
})