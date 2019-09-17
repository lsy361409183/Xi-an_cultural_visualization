define(function(require, exports, module){
    // var $ = require('../libs/jquery-3.3.1.min');

    // 加载导航模板
    var navTpl = require('../views/templates/navigation.tpl')
    var nav_container = $('#nav-tpl');
    nav_container.html(navTpl);

    // 设置地图容器的高度
    function setMapHeight() {
        var clientHeight = $(window).height();

        // 获取导航高度
        var nav_height = $('#nav-tpl').height();

        var map_container = $('.map-container #visualization-map');

        map_container.css('height', (clientHeight - nav_height)+'px');
    }
    setMapHeight();
    // 浏览器高度变化时
    $(window).resize(function () {
        setMapHeight();
    });


    /**
     * 地图相关图层加载
     * mapData                 西安底图
     * pointData               西安文地点
     * cultural_mapData        西安文地块
     *
     * */

    var mapData = {},
        pointData = [],
        cultural_mapData = {};

    // 设置底图投影
    var projection = new ol.proj.Projection({
        code: 'EPSG:4326',
        units: 'degrees'
    });
    var view = new ol.View({
        projection: projection,
        center:  [108.936229,34.26215],
        zoom:12,
        maxZoom:25,
        minZoom:5
    });
    var map = new ol.Map({
        layers: [],
        target: 'visualization-map',
        view: view
    });


    // 创建点
    var tempPointArr = pointData.filter(function (item) {
        return item.basePoint !== null;
    });
    var pointArr = tempPointArr.map(function (item) {
        var pointCoordArr = item.basePoint.split(',');
        return new ol.Feature(new ol.geom.Point(
            [Number(pointCoordArr[0]),Number(pointCoordArr[1])]
        ))
    });
    var pointSource = new ol.source.Vector({
        features: pointArr
    });

    var cultural_point = new ol.layer.Vector({
        source: pointSource,
        zIndex: 1,
        style: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: '#fff'
                }),
                fill: new ol.style.Fill({
                    color: '#FF0033'
                })
            })
        })
    });
    map.addLayer(cultural_point)



    // 请求地图geojson
    function getMapGeoJson (render) {
        $.ajax({
            type:"get",
            url:"/getMapData",
            data: {mapId: 1},
            dataType:"json",
            success:function(res){
                mapData = res;
                render(res);
            }
        });
    }
    // 请求文地块geojson
    function getCulturalMap(render) {
        $.ajax({
            type:"get",
            url:"/getMapData",
            data: {mapId: 3},
            dataType:"json",
            success: function(res){
                cultural_mapData = res
                render(res);
            }
        });
    }

    // 请求文地点数据
    function getPointData(areas, types, render) {
        var params = {
            baseDistrict: areas === "'全部'"? areas : areas.map(function (item) {
                return "\'" + item + "\'"
            }).join(','),
            baseClassification: types === "'全部'"? types : types.map(function (item) {
                return "\'" + item + "\'"
            }).join(',')
        };
        $.ajax({
            type: 'post',
            url: '/getFilterData',
            // contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data: params,
            success: function (res) {
                console.log('文地点res==============',res)
                pointData = res;
                render(res)
            }
        })
    }

    // 渲染底图
    function renderMap (data) {
        var vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(data)
            }),
            zIndex: 0
        });
       var test =  map.getLayerGroup();
       console.log('test', test)
        map.addLayer(vectorLayer);
    }

    // 渲染文地点
    function renderPoint (data) {
        map.removeLayer(cultural_point);
        // featureOverlay.getSource().removeFeature(highlight);
        // 创建点
        tempPointArr = data.filter(function (item) {
            return item.basePoint !== null;
        });
        pointArr = tempPointArr.map(function (item) {
            var pointCoordArr = item.basePoint.split(',');
            return new ol.Feature({
                geometry:  new ol.geom.Point([Number(pointCoordArr[0]),Number(pointCoordArr[1])]),
                baseName: item.baseName,
                baseArea: item.baseArea,
                baseDistrict: item.baseDistrict,
                baseClassfication: item.baseClassfication
            })
        });
        pointSource = new ol.source.Vector({
            features: pointArr
        });

        cultural_point = new ol.layer.Vector({
            source: pointSource,
            zIndex: 2,
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: '#fff'
                    }),
                    fill: new ol.style.Fill({
                        color: '#FF0033'
                    })
                })
            })
        });

        // 地图根据文地点范围显示
        // 计算经度最大值
        var mLngPoint =tempPointArr.sort(function (a, b) {
            var tempLngA = Number(a.basePoint && a.basePoint.split(',')[0]),
                tempLatB = Number(b.basePoint && b.basePoint.split(',')[0]);
            return tempLatB - tempLngA
        });
        var maxLng = mLngPoint[0].basePoint.split(',')[0],
            minLng = mLngPoint[mLngPoint.length - 1].basePoint.split(',')[0]
        // 计算纬度最大值
        var mLatPoint =tempPointArr.sort(function (a, b) {
            var tempLatA = Number(a.basePoint && a.basePoint.split(',')[1]),
                tempLatB = Number(b.basePoint && b.basePoint.split(',')[1]);
            return tempLatB - tempLatA
        });
        var maxLat = mLatPoint[0].basePoint.split(',')[1],
            minLat = mLatPoint[mLatPoint.length - 1].basePoint.split(',')[1]

        // 拼装一个矩形框
        var topLeft = [minLng, maxLat],
            topRight = [maxLng, maxLat],
            bottomLeft = [minLng, minLat],
            bottomRight = [maxLng, minLat];

        var coorMaxBox = [topLeft, topRight, bottomRight, bottomLeft];
        var coorMaxBoxFeature = new ol.Feature({
            geometry: new ol.geom.Polygon([coorMaxBox])
        });

        // 添加一个透明图层
        var coorMaxBoxLayer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(0,0,0,0)',
                    width: 1
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(0,0,0,0)'
                })
            })
        });

        // 缩放到文地点的范围
        coorMaxBoxLayer.getSource().addFeature(coorMaxBoxFeature);
        var feature = coorMaxBoxLayer.getSource().getFeatures()[0];
        var polygon = (feature.getGeometry());
        var size = (map.getSize());
        view.fit(polygon,size,{padding:[300,300,300,150],constrainResolution: false});

        map.addLayer(cultural_point)
    }

    // 渲染文地块
    function renderCulturalMap () {
        var cultural_vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(cultural_mapData)
            }),
            zIndex: 1,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: "rgba(0, 153, 51, 0.5)"
                }),
                stroke: new ol.style.Stroke({
                    color: "#ffcc33",
                    width: 1
                })
            })
        });
        map.addLayer(cultural_vectorLayer);
    }
    // 加载地图
    getMapGeoJson(renderMap);
    getPointData("'全部'", "'全部'", renderPoint);
    getCulturalMap(renderCulturalMap);



    /**
     * 复选框部分
     *
     * */

    // 区域复选点击事件
    $('.area-districts').on('click',function (e) {
        var poi=$('#POI').val();
        if(poi == null||poi == ""||poi == undefined){
            var areaCheckedVal = valChange('area-districts');
            var typeCheckedVal = valChange('area-types');

            getAreaData(areaCheckedVal,typeCheckedVal)
            console.log('点击区域复选参数===========================',areaCheckedVal,typeCheckedVal);

            // var temp = JSON.stringify(areaCheckedVal);
            // console.log('temp',temp)
            // console.log('parse', JSON.parse(temp))
            var types = typeCheckedVal.length === 6 || typeCheckedVal==0? "'全部'" : typeCheckedVal
            if (areaCheckedVal.length === 7) {
                $('#area-all').prop('checked', true);
                getPointData("'全部'", types, renderPoint)
            } else if (areaCheckedVal.length === 0) {
                $('#area-all').prop('checked', false);
                getPointData("'全部'",types, renderPoint)
            } else {
                $('#area-all').prop('checked', false);
                getPointData(areaCheckedVal, types, renderPoint)
            }
        }
    });

    // 类型复选点击事件
    $('.area-types').on('click',function (e) {

        var areaCheckedVal = valChange('area-districts');
        var typeCheckedVal = valChange('area-types');
        getAreaData(areaCheckedVal,typeCheckedVal);
        console.log('点击类型复选参数===========================',areaCheckedVal,typeCheckedVal);
        var areas = areaCheckedVal.length === 7 || areaCheckedVal===0? "'全部'" : areaCheckedVal
        if (typeCheckedVal.length === 6) {
            $('#type-all').prop('checked', true);
            getPointData(areas, "'全部'", renderPoint)
        } else if (typeCheckedVal.length === 0) {
            $('#type-all').prop('checked', false);
            getPointData(areas,"'全部'", renderPoint)
        } else {
            $('#type-all').prop('checked', false);
            getPointData(areas,typeCheckedVal, renderPoint)
        }
    });
    function valChange (type) {
       var tempArr = $('input[class="'+type+'"]:checked') && $('input[class="'+type+'"]:checked').map(function (index, item) {
            return item.value;
        });
       return $.makeArray(tempArr)
    }

    // 区域全选
    $('#area-all').change(function () {
        var poi=$('#POI').val();
        if(poi == null||poi == ""||poi == undefined) {
            var typeCheckedValTemp = valChange('area-types');
            this.checked === false ? $('.area-districts').prop('checked', false) : $('.area-districts').prop('checked', true);
            var typeCheckedVal = typeCheckedValTemp && typeCheckedValTemp.length === 0 || typeCheckedValTemp.length === 6
                ? "'全部'" : typeCheckedValTemp;

            console.log('点击区域全选-类型传参==============', typeCheckedVal)
            getPointData("'全部'", typeCheckedVal, renderPoint);
            getAreaData(valChange('area-districts'),valChange('area-types'));
        }
        else {
            // if($('#area-all').prop('checked',true)){
            //     $('.area-districts').prop('checked',true)
            // }
            // if($('#area-all').prop('checked',false)){
            //     $('.area-districts').prop('checked',false)
            // }
            var typeCheckedValTemp = valChange('area-types');
            this.checked === false ? $('.area-districts').prop('checked', false) : $('.area-districts').prop('checked', true);
        }
    });

    // 类型全选
    $('#type-all').change(function () {
        var areaCheckedValTemp = valChange('area-districts');
        this.checked === false ? $('.area-types').prop('checked', false): $('.area-types').prop('checked', true);
        var areaCheckedVal = areaCheckedValTemp &&　areaCheckedValTemp.length === 0 || areaCheckedValTemp.length===7
            ? "'全部'" : areaCheckedValTemp;

        console.log('点击类型全选-区域传参==============',areaCheckedVal)
        getPointData(areaCheckedVal, "'全部'", renderPoint);
        getAreaData(valChange('area-districts'),valChange('area-types'));

    });

    // 初次加载默认全选
    (function defaultChecked(){
        $('.area-districts').prop('checked', true);
        $('.area-types').prop('checked', true);
        $('#area-all').prop('checked', true);
        $('#type-all').prop('checked', true);
    })()

    //POI搜索
    // 请求POI拿到文地数据
    function POISelect(render) {
        var poi=$('#POI').val();
        console.log('poi',poi)

        var areaCheckedVal = valChange('area-districts');
            console.log('区域是',areaCheckedVal)
        var area=areaCheckedVal.map(function (item) {
            return "\'" + item + "\'"}).join(',')
        console.log('转变后的区域是',area)
        var params = {
            baseDistrict: area,
            baseName: poi
        };
        $.ajax({
            type:"get",
            url:"/getSearchData",
            data: params,
            dataType:"json",
            success:function(res){
                pointData = res;
                render(res)
            }
        });
    }
    //点击搜索，调用方法
    $('#POIName').on('click',function (){
        POISelect(renderPoint)
    })
    //改变焦点 类别变暗
    $("#POI").on('input propertychange',function(){
        var poi=$('#POI').val();
        console.log(poi)
        if(!(poi == null||poi == ""||poi == undefined))
        {
            $('.area-types').prop("disabled",true);
            $('#type-all').prop("disabled",true);
        }
        else
        {
            $('.area-types').prop("disabled",false);
            $('#type-all').prop("disabled",false);
        }
    })

    /**
     * 添加信息窗体
     *
     * */
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    var overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });

    // 关闭按钮事件
    closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        featureOverlay.getSource().removeFeature(highlight);
        highlight = null;
        return false;
    };
    map.addOverlay(overlay);

    // 高亮样式
    var highlight;
    var highlightStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            stroke: new ol.style.Stroke({
                color: 'rgb(0,255,255)'
            }),
            fill: new ol.style.Fill({
                color: 'rgb(0,255,255)'
            })
        })
    });

    var featureOverlay = new ol.layer.Vector({
        source: new ol.source.Vector(),
        map: map,
        style: highlightStyle
    });
    map.on('click', function(evt) {
        console.log('evt',evt)
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function(feature) {
                console.log('feature============',feature)
                return feature;
            });
        var isShowInfo = true,
            hasName = feature.get('baseName');
        hasName === undefined ? isShowInfo = false : isShowInfo = true;


        var popContent = "<p class='pop-text'><b>文地名称：</b>"+feature.get('baseName') +
            "</p><p class='pop-text'><b>文地面积：</b>"+feature.get('baseArea') + "公顷" +
            "</p><p class='pop-text'><b>文地区域：</b>"+feature.get('baseDistrict') +
            "</p><p class='pop-text'><b>文地类型：</b>"+feature.get('baseClassfication') + "</p>";

        if (feature !== highlight) {
            if (isShowInfo){
                if (highlight) {
                    featureOverlay.getSource().removeFeature(highlight);
                }
                if (feature) {
                    featureOverlay.getSource().addFeature(feature);
                    // console.log('feature', feature)
                    var coordinates = feature.getGeometry().getCoordinates();
                    content.innerHTML = popContent;
                    overlay.setPosition(coordinates);

                    highlight = feature;
                }
            } else {
                if (highlight) {
                    featureOverlay.getSource().removeFeature(highlight);
                    overlay.setPosition(undefined);
                    closer.blur();
                    highlight = null;
                }
                return false
            }


        }
    });





    //堆叠柱状图
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    // 指定图表的配置项和数据
    getAreaData(valChange('area-districts'),valChange('area-types'));

    // 请求不同类别不同区域面积数据
    function getAreaData(areas, types) {
        var params = {
            baseDistrict: areas === "'全部'" || areas.length===0? "'未央区','灞桥区','明城区','新城区','碑林区','莲湖区'" : areas.map(function (item) {
                return "\'" + item + "\'"
            }).join(','),
            baseClassification: types === "'全部'" || types.length===0 ? "'visual_first','visual_second','visual_third','visual_fourth','visual_fifth','visual_sixth'": types.map(function (item) {
                return item === '一类文地' ? 'visual_first': item === '二类文地' ? 'visual_second' : item === '三类文地' ? 'visual_third' :
                    item === '四类文地' ? 'visual_fourth' :item === '五类文地' ? 'visual_fifth' :'visual_sixth'
            }).join(',')
        };
        $.ajax({
            type: 'post',
            url: '/getAreaData',
            // contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data: params,
            success: function (data) {
                var area =data.map(function (item) {
                    return item.baseDistrict
                });
                console.log('地区的值==================================',area)
                console.log('类别的值==================================',types)

                var id_array=new Array();
                $('.area-types').each(function(){
                    id_array.push($(this).val());//向数组中添加元素
                });
                console.log('1111111111111111111111111',  id_array.map(function (item) {
                    return "\'" +item+"\'"
                }).join(','));
                // function refreshData(data){
                //     //刷新数据
                //     var option = myChart.getOption();
                //     option.data= data;
                //     myChart.setOption(option);
                // refreshData(data);//自定义刷新的时候调用

                var option = {

                    title: {
                        // text: '堆叠柱状图'
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        x:'left',
                        selectedMode:false,
                        data: types
                    },
                    grid: {
                        left: '3%',
                        right: '15%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : area
                        }
                    ],
                    yAxis : [
                        {
                            name:'面积/公顷',
                            type : 'value',
                            // axisLabel: {
                            //     formatter: '{value} 公顷'
                            // },
                        }
                    ],

                    series :
                        types.map(function (item) {
                            return item === '一类文地' ? 'visualFirst': item === '二类文地' ? 'visualSecond' : item === '三类文地' ? 'visualThird' :
                                item === '四类文地' ? 'visualFourth' :item === '五类文地' ? 'visualFifth' :'visualSixth'
                        }).map(function (item) {
                            return {
                                name: item === 'visualFirst' ? '一类文地':
                                    item === 'visualSecond' ? '二类文地':
                                        item === 'visualThird' ? '三类文地':
                                            item === 'visualFourth' ? '四类文地':
                                                item === 'visualFifth' ? '五类文地':
                                                    item === 'visualSixth' ? '六类文地':
                                                        null
                                ,
                                type:'bar',
                                stack: '类别',
                                data: data.map(function (child) {

                                    console.log('item+++++++++++++++++',item)
                                    console.log('child[item]+++++++++++++++++',child[item])
                                    return child[item]

                                })
                            }
                        })
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option,true);

            }
        })
    }



});