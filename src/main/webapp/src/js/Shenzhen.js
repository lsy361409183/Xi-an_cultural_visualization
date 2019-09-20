define(function(require, exports, module){
    // var $ = require('../libs/jquery-3.3.1.min');

    // 加载导航模板
    var navTpl = require('../views/templates/navigation.tpl');
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

        // 设置底图投影
    var projection = new ol.proj.Projection({
            code: 'EPSG:4326',
            units: 'degrees'
        });
    var view = new ol.View({
        projection: projection,
        center:[113.980026,22.560237],
        zoom:13,
        maxZoom:25,
        minZoom:5
    });
    var map = new ol.Map({
        layers: [],
        target: 'map1',
        view: view
    });

    // var pointData = null;
    // // 创建点
    // var tempPointArr = pointData.filter(function (item) {
    //     return item.basePoint !== null;
    // });
    // var pointArr = tempPointArr.map(function (item) {
    //     var pointCoordArr = item.basePoint.split(',');
    //     return new ol.Feature(new ol.geom.Point(
    //         [Number(pointCoordArr[0]),Number(pointCoordArr[1])]
    //     ))
    // });
    // var pointSource = new ol.source.Vector({
    //     features: pointArr
    // });
    //
    // var cultural_point = new ol.layer.Vector({
    //     source: pointSource,
    //     zIndex: 1,
    //     style: new ol.style.Style({
    //         image: new ol.style.Circle({
    //             radius: 5,
    //             stroke: new ol.style.Stroke({
    //                 color: '#fff'
    //             }),
    //             fill: new ol.style.Fill({
    //                 color: '#FF0033'
    //             })
    //         })
    //     })
    // });
    // map.addLayer(cultural_point);



    // 请求地图geojson
    function getMapGeoJson (render) {
        $.ajax({
            type:"get",
            url:"/getMapData",
            data: {mapId: 20},
            dataType:"json",
            success:function(res){

                console.log('aaa',res);
                render(res);
            }
        });

    }
    // 请求文地点geojson
    function getPointData(render) {
        $.ajax({
            type:"get",
            url:"/getMapData",
            data: {mapId: 21},
            dataType:"json",
            success: function(res){
                pointData = res;
                render(res);
                console.log('bbbbbbbbbbbbbbbbbb',res);
            }
        });
    }
    // 请求文地块geojson
    function getCulturalMap(render) {
        $.ajax({
            type:"get",
            url:"/getMapData",
            data: {mapId: 22},
            dataType:"json",
            success: function(res){
                console.log('文地块res==============',res);

                console.log('aaa',res);
                render(res);
            }
        });
    }

    // 渲染底图
    function renderMap (data) {
        var vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(data)
            }),
            zIndex: 0
        });
        map.addLayer(vectorLayer);
    }

    // 渲染文地点
    function renderPoint (data) {
        var point_vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(data)
            }),
            zIndex : 99,
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
        map.addLayer(point_vectorLayer);
    }



    // 渲染文地块
    function renderCulturalMap (data) {
        var cultural_vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(data)
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
    getCulturalMap(renderCulturalMap);
    getPointData(renderPoint);

});

