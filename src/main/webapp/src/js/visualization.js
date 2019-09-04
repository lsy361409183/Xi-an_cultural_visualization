define(function(require, exports, module){
    // var $ = require('../libs/jquery-3.3.1.min');

    // 加载导航模板
    var navTpl = require('../views/templates/navigation.tpl')
    var nav_container = $('#nav-tpl');
    nav_container.html(navTpl);

    // 设置地图容器的高度
    function setMapHeight() {
        var clientHeight = $(window).height();

        // console.log(clientHeight);
        // 获取导航高度
        var nav_height = $('#nav-tpl').height();
        // console.log('nav_height',nav_height);
        var map_container = $('.map-container #visualization-map');
        // console.log('map_container',map_container);
        map_container.css('height', (clientHeight - nav_height)+'px');
    }
    setMapHeight();
    // 浏览器高度变化时
    $(window).resize(function () {
        setMapHeight();
    });

    // 请求地图geojson
    function getGeoJson () {
        $.ajax({
            type:"get",
            url:"/getMapData",
            data: {mapId: 1},
            dataType:"json",
            success:function(res){
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
                var vectorLayer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: (new ol.format.GeoJSON()).readFeatures(res)
                    })
                });
                var map = new ol.Map({
                    layers: [
                        vectorLayer
                    ],
                    target: 'visualization-map',
                    view: view
                })
            }
        });
    }

    // 加载地图
    getGeoJson();
});