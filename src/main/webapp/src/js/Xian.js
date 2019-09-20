define(function(require, exports, module){
    // var $ = require('../libs/jquery-3.3.1.min');

    // 加载导航模板
    var navTpl = require('../views/templates/navigation.tpl')
    var nav_container = $('#nav-tpl');
    nav_container.html(navTpl);

    function setMapHeight() {
        var clientHeight = $(window).height();

        // 获取导航高度
        var nav_height = $('#nav-tpl').height();

        var map_container = $('#map');

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
        target: 'map',
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
    map.addLayer(cultural_point);



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
                console.log('文地块res==============',res);

                cultural_mapData = res;
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
                console.log('文地点res==============',res);
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
        map.removeLayer(cultural_point)
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
    getCulturalMap(renderCulturalMap);
});