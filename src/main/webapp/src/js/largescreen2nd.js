 define(function (require,exports, module) {
    var navTpl = require('../views/templates/navigation.tpl')
    var nav_container = $('#nav-tpl');
    nav_container.html(navTpl);


     var url = "";
     var map, district, polygons = [],
         mapData = [],
         cityCode = 100000,
         cityName = '中国',
         areaCode = 10000,
         geoJsonData = '';
     var areaData = {};
     var deepTree = [{mapData: mapData,code: 610100}];


     $('.back').click(function(){

         if(deepTree.length>1) {
             mapData = deepTree[deepTree.length - 1].mapData
             deepTree.pop();
             console.log(deepTree[deepTree.length - 1])
             console.log(deepTree[deepTree.length - 1],'back')
             loadMapData(deepTree[deepTree.length - 1].code)
             console.log(deepTree[deepTree.length - 1].code)
         }
     })

     map = new AMap.Map('pic3', {
         resizeEnable: true,
         center: [116.30946, 39.937629],
         zoom: 3,
     });
     AMap.plugin('AMap.DistrictSearch',function(){//异步加载插件
         var districtSearch = new AMap.DistrictSearch();
         map.addControl(districtSearch);
     });
     //行政区划查询
     var opts = {
         subdistrict: 1, //返回下一级行政区
         showbiz: false //最后一级返回街道信息
     };
     district = new AMap.DistrictSearch(opts); //注意：需要使用插件同步下发功能才能这样直接使用
     district.search('西安市', function(status, result) {
         if (status == 'complete') {
             getData(result.districtList[0], '', 610100);
         }
     });

     function echartsMapClick(params) { //地图点击事件
         if (!params.data || params.data.level == 'street') return;
         cityName = params.data.name;
         cityCode = params.data.cityCode;
         district.setLevel(params.data.level); //行政区级别
         district.setExtensions('all');
         //行政区查询
         //按照adcode进行查询可以保证数据返回的唯一性
         console.log(cityCode)

         district.search(params.data.cityCode, function (status, result) {
             if (status === 'complete') {
                 deepTree.push({mapData: mapData,code: params.data.cityCode});
                 getData(result.districtList[0], params.data.level, params.data.cityCode);
             }
         });
         setSearchOption(params.data, params.data.level, params.data.cityCode);

     };

     function loadMapData(areaCode) {
         console.log(areaCode,'loadCode'),
             AMapUI.loadUI(['geo/DistrictExplorer'],function (DistrictExplorer) {
                 //创建一个实例
                 var districtExplorer = window.districtExplorer = new DistrictExplorer({
                     eventSupport: true, //打开事件支持
                     map: map
                 });
                 //动态的获取城市的mapJson数据
                 districtExplorer.loadAreaNode(areaCode,function (error, areaNode) {
                     if (error) {
                         console.error(error);
                         return;
                     }
                     var mapJson = {};
                     console.log(areaNode)
                     // areaNode对象执行这个方法返回的geoJSON中的features。区县级以及部分没有子级的区划（比如台湾，东莞等）不在该列表中，也没有对应的AreaNode，它们的数据存在于其父级对应的AreaNode中。
                     // 比如东莞的数据可以通过加载广东省的AreaNode，然后调用 getSubFeatureByAdcode 获取
                     mapJson.features = areaNode.getSubFeatures();
                     console.log(cityName,mapJson,'loadmap')
                     loadMap(cityName, mapJson);
                     geoJsonData = mapJson;
                 })
             });
     };
     var myChart3 = echarts.init(document.getElementById('pic3'));
     function loadMap(mapName, data) {
         if (data) {
             echarts.registerMap(mapName, data);
             var option = {
                 title:{
                     x:'40%',
                     Y:'30%',
                     text: '西安文地分布',
                     textStyle:{
                         color:'#1e90ff'
                     },
                 },
                 // backgroundColor: 'rgba(0,0,0,0)',
                 visualMap: {
                     type: 'piecewise',
                     pieces: [{
                         max: 1,
                         label:'没数据',
                         color:'#83c2ff',
                         // '#fffb74'
                     },
                         {
                             min: 1,
                             max: 99,
                             label:'文地面积<100万顷',
                             color:'#56acff'
                             // '#ffe475'
                         },
                         {
                             min: 100,
                             max: 999,
                             label:'文地面积<1000万顷',
                             color: '#1e90ff'
                             // '#ffda42'
                         },
                         {
                             min: 1000,
                             max: 4999,
                             label:'文地面积<5000万顷',
                             color: '#4169E1'
                         },
                         {
                             min: 4000,
                             max: 9999,
                             label:'文地面积<10000万顷',
                             color:'#0000FF'
                             // '#ffa303'
                         },
                         {
                             min: 10000,
                             label:'文地面积>10000万顷',
                             color: '#00008B'
                             // '#ff6903'
                         },
                     ],
                     // color: '#fff',
                     textStyle: {
                         color: '#1352b5',
                     },
                     visibility: 'off'
                 },
                 series: [{
                     name: '数据名称',
                     type: 'map',
                     roam: false,
                     mapType: mapName,
                     selectedMode: 'single',
                     showLegendSymbol: false,
                     visibility: 'off',
                     itemStyle: {
                         normal: {
                             color: '#7ba3bb',
                             areaColor: '#fff',
                             borderColor: '#fff',
                             borderWidth: 0.5,
                             label: {
                                 show: true,
                                 textStyle: {
                                     color: "#fff"
                                 }
                             }
                         },
                         emphasis: {
                             areaColor: '#1e90ff',
                             borderColor: '#fff',
                             areaStyle: {
                                 color: '#fff'
                             },
                             label: {
                                 show: true,
                                 textStyle: {
                                     color: "rgb(249, 249, 249)"
                                 }
                             }
                         }
                     },
                     data:
                     // mapData,
                         [
                             {name: "阎良区", value: 0, cityCode: "610114", level: "district"},
                             {name: "临潼区", value: 0, cityCode: "610115", level: "district"},
                             {name: "鄠邑区", value: 0, cityCode: "610118", level: "district"},
                             {name: "高陵区", value: 0, cityCode: "610117", level: "district"},
                             {name: "蓝田县", value: 0, cityCode: "610122", level: "district"},
                             {name: "长安区", value: 0, cityCode: "610116", level: "district"},
                             {name: "未央区", value: 350774.93, cityCode: "610112", level: "district"},
                             {name: "莲湖区", value: 36.41, cityCode: "610104", level: "district"},
                             {name: "周至县", value: 0, cityCode: "610124", level: "district"},
                             {name: "灞桥区", value: 2087.91, cityCode: "610111", level: "district"},
                             {name: "新城区", value: 371.10, cityCode: "610102", level: "district"},
                             {name: "碑林区", value: 84.11, cityCode: "610103", level: "district"},
                             {name: "雁塔区", value: 518.56, cityCode: "610113", level: "district"},
                         ],
                 }]
             };
             myChart3.setOption(option);
         }
     };
     myChart3.on('click', echartsMapClick);
     var lastCode = '';
     myChart3.on('mousemove', function(params) {
         var city = params.data.name;
         var city = city.substring(0, 2);
         lastCode = params.data.cityCode
         var layerX = params.event.offsetX;
         var layerY = params.event.offsetY;
         var heightAdd = 80;
     });

     myChart3.on('mouseout', function(params) {
     });

     function getData(data, level, adcode) {
         var bounds = data.boundaries;
         if (bounds) {
             for (var i = 0, l = bounds.length; i < l; i++) {
                 var polygon = new AMap.Polygon({
                     map: map,
                     strokeWeight: 1,
                     strokeColor: '#0091ea',
                     fillColor: '#80d8ff',
                     fillOpacity: 0.2,
                     path: bounds[i]
                 });
                 polygons.push(polygon);
             }
             map.setFitView(); //地图自适应
         }

         setSearchOption(data, level, adcode);

     }

     function setSearchOption(data, level, adcode) {
         var subList = data.districtList;
         if (subList) {
             var contentSub = new Option('--请选择--');
             var curlevel = subList[0].level;
             if (curlevel === 'street') {
                 var mapJsonList = geoJsonData.features;
                 var mapJson = {};
                 for (var i in mapJsonList) {
                     if (mapJsonList[i].properties.name == cityName) {
                         mapJson.features = [].concat(mapJsonList[i]);
                     }
                 }
                 mapData = [];
                 mapData.push({
                     name: cityName,
                     value: Math.random() * 100,
                     level: curlevel
                 });
                 loadMap(cityName, mapJson);
                 geoJsonData = mapJson;
                 return;
             }
             var curList = document.querySelector('#' + curlevel);
             curList.add(contentSub);
             mapData = [];
             for (var i = 0, l = subList.length; i < l; i++) {
                 var name = subList[i].name;
                 var citycode = subList[i].adcode;
                 mapData.push({
                     name: name,
                     value: Math.random() * 100,
                     cityCode: citycode,
                     level: curlevel
                 });
                 var levelSub = subList[i].level;
                 contentSub = new Option(name);
                 contentSub.setAttribute("value", levelSub);
                 contentSub.setAttribute("text", name);
                 contentSub.center = subList[i].center;
                 contentSub.adcode = subList[i].adcode;
                 curList.add(contentSub);
             }
             loadMapData(adcode);
             areaData[curlevel] = curList;
         }
     }

     function search(obj) {
         //清除地图上所有覆盖物
         for (var i = 0, l = polygons.length; i < l; i++) {
             polygons[i].setMap(null);
         }
         var option = obj[obj.options.selectedIndex];
         var keyword = option.text; //关键字
         var adcode = option.adcode;
         cityName = keyword;
         cityCode = adcode;
         district.setLevel(option.value); //行政区级别
         district.setExtensions('all');
         //行政区查询
         //按照adcode进行查询可以保证数据返回的唯一性
         district.search(adcode, function(status, result) {
             if (status === 'complete') {
                 deepTree.push({mapData: mapData,code:adcode});
                 getData(result.districtList[0], obj.id, adcode);
             }
         });
     }

     function setCenter(obj) {
         map.setCenter(obj[obj.options.selectedIndex].center)
     }



     var myChart1 = echarts.init(document.getElementById('pic1'));
         var option1 = {
         // backgroundColor: '#f0f2f5',
         title: {
             text: '文地总面积(单位：万顷)',
             x:'10%',
             y:'5%',
             textStyle:{
                 color:'#1e90ff'
             },
         },
         series: [
             {
                 name: '内圈小',
                 type: 'gauge',
                 center: ['50%', '70%'],
                 pointer:{
                     show:false
                 },
                 radius: '90%',
                 startAngle: 160,
                 endAngle: -20,
                 splitNumber: 4,
                 axisLine: { // 坐标轴线
                     lineStyle: { // 属性lineStyle控制线条样式
                         color: [
                             [1, '#bfcbd9']
                         ],
                         width: 20
                     }
                 },
                 splitLine: { //分隔线样式
                     show: false,
                 },
                 axisLabel: { //刻度标签
                     show: false,
                 },
                 axisTick: { //刻度样式
                     show: false,
                 },
                 detail: {
                     // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                     fontWeight: 'bolder',
                     fontSize:30,
                     offsetCenter:[0, '50%']
                 },
                 data: [{
                     value: '262371',
                     name: ''
                 }]
             }, {
                 name: '内圈小',
                 type: 'gauge',
                 center: ['50%', '70%'],
                 title : {
                     // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                     fontWeight: 'bolder',
                     fontSize: 30,
                     fontStyle: 'italic',
                     offsetCenter: [0, '50%'],
                 },
                 pointer:{
                     show:true
                 },
                 radius: '90%',
                 startAngle: 200,
                 endAngle: 50,
                 splitNumber: 4,
                 axisLine: { // 坐标轴线
                     lineStyle: { // 属性lineStyle控制线条样式
                         color: [
                             [1, '#0093ee']
                         ],
                         width: 20,
                         shadowColor: '#0093ee', //默认透明
                         shadowOffsetX: 0,
                         shadowOffsetY: 0,
                         shadowBlur: 40,
                         opacity: 1,
                     }

                 },
                 splitLine: { //分隔线样式
                     show: false,
                 },
                 axisLabel: { //刻度标签
                     show: false,
                 },
                 axisTick: { //刻度样式
                     show: false,
                 },
                 detail: {
                     // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                     fontWeight: 'bolder',
                     fontSize:30,
                     offsetCenter:[0, '50%']
                 },
                 data: [{
                     value: '262371',
                     name: ''
                 }]
             },

         ]
     };
         myChart1.setOption(option1);
     var myChart2 = echarts.init(document.getElementById('pic2'));
        var option2 = {
                title:{
                    text:'面积排名前十的文地',
                    textStyle:{
                        color:'#1e90ff'
                    },
                },
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : ['A', 'B', 'C', 'D', 'E', 'F', 'G','H','I','J'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'文地面积',
                        type:'bar',
                        barWidth: '60%',
                        data:['110', '100','90' , '80', '70', '60', '50','40','30','20'],
                    }
                ]
            };
        myChart2.setOption(option2);
     var myChart4 = echarts.init(document.getElementById('pic4'));
     var option4 = {
         title: {
             text: '不同区域的文地面积之比',
             left: 'center',
             top: '1%',
             padding: [24, 0],
             textStyle:{
                 color:'#1e90ff'
             },
         },
         color: ['#6f98da', '#4780da', '#1352b5', '#1f9ad0', '#54bbe7','#7bc7e7'],
         tooltip: {
             trigger: 'item',
             formatter: "{a} <br/>{b}: {c} ({d}%)"
         },
         legend: {
             orient: 'vertical',
             x: 'left',
             y:'30%',
             textStyle: {
                 color: '#1e90ff'
             },
             data:['未央区', '莲湖区', '灞桥区', '新城区', '碑林区', '雁塔区']
         },
         series: [
             {
                 name:'文地面积',
                 type:'pie',
                 center:['50%','60%'],
                 radius: ['50%', '70%'],
                 // avoidLabelOverlap: false,
                 label: {
                     normal: {
                         show: false,
                         position: 'center'
                     },
                     emphasis: {
                         show: true,
                         textStyle: {
                             fontSize: '30',
                             fontWeight: 'bold'
                         }
                     }
                 },
                 labelLine: {
                     normal: {
                         show: false
                     }
                 },
                 data:''
                 //     [
                 //     {value:335, name:'未央区'},
                 //     {value:310, name:'莲湖区'},
                 //     {value:234, name:'灞桥区'},
                 //     {value:135, name:'新城区'},
                 //     {value:1548, name:'碑林区'},
                 //     {value:1548, name:'雁塔区'},
                 // ]
             }
         ]
     };
console.log(option4)
     myChart4.setOption(option4);
     var myChart5 = echarts.init(document.getElementById('pic5'));
        //数据是自定义的，嗯，试试数组循环替换，或者换张图
        var option5 = {
         title:{
             text:'不同区域的不同类别的文地面积对比',
             textStyle:{
                 color:'#1e90ff'
             },
         },
         legend: {
             show: true,
             x:'5%',
             y:'90%',
             data: ['一类', '二类', '三类']
         },
         color: ['#7bc7e7','#0b61a4','#1f9ad0',],
         angleAxis: {
             type: 'category',
             data: ['未央区', '莲湖区', '灞桥区', '新城区','碑林区','雁塔区'],
             z: 10
         },
         radiusAxis: {

         },
         polar: {
             radius:'70%',
         },
         series: [{
             type: 'bar',
             data: [1, 2, 3, 4, 3, 5, ],
             coordinateSystem: 'polar',
             name: '一类',
             stack: 'a'
         }, {
             type: 'bar',
             data: [2, 4, 6, 1, 3, 2, ],
             coordinateSystem: 'polar',
             name: '二类',
             stack: 'a'
         }, {
             type: 'bar',
             data: [1, 2, 3, 6, 1, 2, ],
             coordinateSystem: 'polar',
             name: '三类',
             stack: 'a'
         }],

     };
     myChart5.setOption(option5);

     function Render(cityCode,type){
         // var path=cityCode+type
         $.getJSON("../../json/610112pie.json", function (data){
         // $.getJSON("../json/path.json", function (data){
             var option4 = myChart4.getOption();
             option4.series[0].data =data.data;
             myChart4.setOption(option4);
             })
         }
    Render(610112,"pie")
 })