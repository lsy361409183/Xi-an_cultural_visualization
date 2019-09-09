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

    /**
     * areaCheckedList             区域复选列表
     * typeCheckedList             文地类型复选列表
     *
     * */


    // 设置底图投影
    var projection = new ol.proj.Projection({
        code: 'EPSG:4326',
        units: 'degrees'
    });
    var view = new ol.View({
        projection: projection,
        center:  [108.939621, 34.343147],
        zoom:10,
        maxZoom:25,
        minZoom:5
    });
    var map = new ol.Map({
        layers: [],
        target: 'visualization-map',
        view: view
    });






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
    function getCulturalMap() {
        $.ajax({
            type:"get",
            url:"/getMapData",
            data: {mapId: 3},
            dataType:"json",
            success:function(res){
                cultural_mapData = res
            }
        });
    }

    // 请求文地点数据
    function getPointData(areas, types, render) {
        var params = {
            baseDistrict: areas === "'全部'"? areas : JSON.stringify(areas.map(function (item) {
                return item
            })),
            baseClassification: types === "'全部'"? types : JSON.stringify(types.map(function (item) {
                return item
            }))
        };
        $.ajax({
            type: 'post',
            url: '/getFilterData',
            // contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data: params,
            success: function (res) {
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
            isBaseLayer: true
        });
        map.addLayer(vectorLayer);
    }

    // 渲染文地点
    function renderPoint (data) {
        // 创建点
        var tempPointArr = data.filter(function (item) {
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
            isBaseLayer:false,
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
    }

    // 渲染文地块
    function renderCulturalMap () {
        var cultural_vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(cultural_mapData)
            }),
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




    /**
     * 复选框部分
     *
     * */

    // 区域复选点击事件
    $('.area-districts').on('click',function (e) {

        var areaCheckedVal = valChange('area-districts');
        var typeCheckedVal = valChange('area-types');
        console.log('点击区域复选参数===========================',areaCheckedVal,typeCheckedVal);

        if (areaCheckedVal.length === 7) {
            $('#area-all').prop('checked', true);
            getPointData("'全部'", typeCheckedVal, renderPoint)
        } else if (areaCheckedVal.length === 0) {
            $('#area-all').prop('checked', false);
            getPointData("'全部'",typeCheckedVal, renderPoint)
        } else {
            $('#area-all').prop('checked', false);
            getPointData(areaCheckedVal,typeCheckedVal, renderPoint)
        }
    });

    // 类型复选点击事件
    $('.area-types').on('click',function (e) {

        var areaCheckedVal = valChange('area-districts');
        var typeCheckedVal = valChange('area-types');
        console.log('点击类型复选参数===========================',areaCheckedVal,typeCheckedVal);

        if (typeCheckedVal.length === 6) {
            $('#type-all').prop('checked', true);
            getPointData(areaCheckedVal, "'全部'", renderPoint)
        } else if (typeCheckedVal.length === 0) {
            $('#type-all').prop('checked', false);
            getPointData(areaCheckedVal,"'全部'", renderPoint)
        } else {
            $('#type-all').prop('checked', false);
            getPointData(areaCheckedVal,typeCheckedVal, renderPoint)
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
        var typeCheckedValTemp = valChange('area-types');
        this.checked === false ? $('.area-districts').prop('checked',false) : $('.area-districts').prop('checked',true);
        var typeCheckedVal = typeCheckedValTemp &&　typeCheckedValTemp.length === 0 ? "'全部'" : typeCheckedValTemp;

        console.log('点击区域全选-类型传参==============',typeCheckedVal)
        getPointData("'全部'", typeCheckedVal, renderPoint);
    });

    // 类型全选
    $('#type-all').change(function () {
        var areaCheckedValTemp = valChange('area-districts');
        this.checked === false ? $('.area-types').prop('checked', false): $('.area-types').prop('checked', true);
        var areaCheckedVal = areaCheckedValTemp &&　areaCheckedValTemp.length === 0 ? "'全部'" : areaCheckedValTemp;

        console.log('点击类型全选-区域传参==============',areaCheckedVal)
        getPointData(areaCheckedVal, "'全部'", renderPoint);
    });

    // 初次加载默认全选
    (function defaultChecked(){
        $('.area-districts').prop('checked', true);
        $('.area-types').prop('checked', true);
        $('#area-all').prop('checked', true);
        $('#type-all').prop('checked', true);
    })()






















});