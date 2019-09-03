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


    // 地图相关函数
    var mapData = {},
        pointData = [];
    // 请求地图geojson
    function getMapGeoJson () {
        $.ajax({
            type:"get",
            url:"/getMapData",
            async: false,
            data: {mapId: 1},
            dataType:"json",
            success:function(res){
               mapData = res
            }
        });
    }
    function getPointData() {
        $.ajax({
            type: 'get',
            url: '/getVisualData',
            async: false,
            success: function (res) {
                pointData = res
            }
        })
    }
    function renderMap () {
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
                features: (new ol.format.GeoJSON()).readFeatures(mapData)
            })
        });

        // 创建点
        var tempPointArr = pointData.filter(function (item) {
            return item.basePoint !== null;
        });
        var pointArr = tempPointArr.map(function (item) {
            var pointCoordArr = item.basePoint.split(',');
            return new ol.Feature(new ol.geom.Point([Number(pointCoordArr[0]),Number(pointCoordArr[1])]))
        });
        var pointSource = new ol.source.Vector({
            features: pointArr
        });

        //聚合标注数据源
        // var clusterSource = new ol.source.Cluster({
        //     distance: 40,               //聚合的距离参数，即当标注间距离小于此值时进行聚合，单位是像素
        //     source: pointSource         //聚合的数据源，即矢量要素数据源对象
        // });
        //加载聚合标注的矢量图层
        // var styleCache = {};            //用于保存特定数量的聚合群的要素样式

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
            // style: function (feature, resolution){
            //     console.log('feature',feature);
            //     // console.log('resolution',resolution);
            //     var size = feature.get('features').length;          //获取该要素所在聚合群的要素数量
            //     var style = styleCache[size];
            //     // console.log('size',size);
            //     if(!style){
            //         style = [
            //             new ol.style.Style({
            //                 image: new ol.style.Circle({
            //                     radius: 10,
            //                     stroke: new ol.style.Stroke({
            //                         color: '#fff'
            //                     }),
            //                     fill: new ol.style.Fill({
            //                         color: '#33CC33'
            //                     })
            //                 }),
            //                 text: new ol.style.Text({
            //                     text: size.toString(),
            //                     fill: new ol.style.Fill({
            //                         color: '#fff'
            //                     })
            //                 })
            //             })
            //         ];
            //         styleCache[size] = style;
            //         // console.log('styleCache[size]',styleCache[size]);
            //     }
            //     return style;
            // }
        });

        var map = new ol.Map({
            layers: [
                vectorLayer
            ],
            target: 'visualization-map',
            view: view
        });
        map.addLayer(cultural_point);
    }
    // 加载地图
    getMapGeoJson();
    getPointData();
    renderMap();
});