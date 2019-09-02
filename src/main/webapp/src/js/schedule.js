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
        // columns: [
        //     //表头与对应列的关系
        //     {data:'baseDistrict'},
        //     {data:'baseDistrictId'},
        //     {data: 'baseId'},
        //     {data:'baseName'},
        //     {data:'baseRegion'},
        //     {data:'baseArea'},
        //     {data:'baseDate'},
        //     {data:'basePlaneform'},
        //     {data:'baseClassification'},
        //     {data:'baseBasis'},
        //     {data:'baseUnit'},
        //     {data:'baseRemarks'},
        // ],
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


    //表格
    // var data = [
    //     ["未央区","E-1","1","西安文景公园","西安市文景北路","51.8","2003","不规则形","四类文地","西汉王夫人墓","西安市政府"],
    //     ["未央区","E-1","2","高铁寨汉墓遗址公园","张家堡街道办事处红色村高铁寨","3.63","2017","不规则形","四类文地",
    //         "该公园的建设对加强文物遗产保护，对于传承历史文脉，提升城市文化品位具有重要意义","西安市政府"],
    // ];
    // var container = $('#table')
    // console.log('container',container)
    // container.handsontable({
    //     data: data,
    //     rowHeaders: false,
    //     colHeaders: ['区域','地图编号','编号','名称','区位','规模','建成年代','平面形态','文地分类','依据','文保单位','备注'],
    //     // filters: true,
    //     // dropdownMenu: true,
    //     width:1000,
    //     // wordWrap:true,//自动换行
    //     minRows:20,
    //     minCols:12,
    //     colWidths:['55','65','45','85','65','45','60','70','70','70','60','50'],//x轴上的每行的距离
    //     rowWidths:65,
    //     contextMenu: true,
    //     manualRowResize : true,
    //     manualColumnResize : true,
    // });


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

})