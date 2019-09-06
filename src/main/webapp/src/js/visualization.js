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

    var areaCheckedList = [],
        typeCheckedList = [];

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
    function getMapGeoJson () {
        $.ajax({
            type:"get",
            url:"/getMapData",
            data: {mapId: 1},
            dataType:"json",
            success:function(res){
                mapData = res;
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
        $.ajax({
            type: 'get',
            url: '/getFilterData',
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data: {
                baseDistrict: areas,
                baseClassification: types
            },
            success: function (res) {
                pointData = res;
                render(res)
            }
        })
    }

    // 渲染底图
    function renderMap () {
        var vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(mapData)
            })
        });
        map.addLayer(vectorLayer)
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
        map.addLayer(cultural_point);
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
    setTimeout(function () {
        renderMap();
    },3000);
    getMapGeoJson();
    getPointData("'全部'", "'全部'", renderPoint);




    /**
     * 复选框部分
     *
     * */

    // 区域复选点击事件
    $('.area-districts').on('click',function (e) {
        var areaCheckedVal = valChange('area-districts');
        var typeCheckedVal = valChange('areas-types');
        console.log(areaCheckedVal,typeCheckedVal)
        if (areaCheckedVal.length === 0) {
            getPointData("'全部'", typeCheckedVal, renderPoint)
        } else {
            getPointData(areaCheckedVal,typeCheckedVal, renderPoint)
        }
    });

    function valChange (type) {
       var tempArr = $('input[class="'+type+'"]:checked') && $('input[class="'+type+'"]:checked').map(function (index, item) {
            return item.value;
        });
       return tempArr
    }

    // 区域全选
    $('#area-all').change(function () {
        var _this = $(this);
        var typeCheckedVal = valChange('areas-types');
        if (_this[0].checked === false) {
            $('.area-districts').map(function (index,item) {
                item.disabled = false;
            });

            var areaCheckedVal = valChange('area-districts');
            getPointData(areaCheckedVal, typeCheckedVal, renderPoint)
        } else {
            $('.area-districts').map(function (index,item) {
                item.checked = false;
                item.disabled = true;
            });
            getPointData("'全部'", typeCheckedVal, renderPoint);
        }
    })





});