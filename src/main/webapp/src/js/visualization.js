define(function(require, exports, module){
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
     * mapData                 西安底图geojson
     * pointData               西安文地点数据
     * cultural_mapData        西安文地块geojson
     * allPointData            框选使用的初始数据
     * */

    var mapData = {},
        pointData = [],
        allPointData = [],
        cultural_mapData = {};
    var areaJsonData = []; // 片区geoJson数据
    var areaJsonLayer = null; // 片区geoJson图层
    var isShowImageIcon = false; // 是否显示图形化图标
    var isBoxSelect = false; // 是否是框选
    var boxSelectData = []; // 框选数据
    var highlight; // 用于接收高亮的要素

    // 设置底图投影
    var projection = new ol.proj.Projection({
        code: 'EPSG:4326',
        units: 'degrees'
    });

    // 设置地图显示中心点、默认缩放级别、缩放级别限制
    var view = new ol.View({
        projection: projection,
        center:  [108.936229,34.26215],
        zoom:12,
        maxZoom:25,
        minZoom:5
    });
    // 创建地图
    var map = new ol.Map({
        layers: [],
        target: 'visualization-map',
        view: view
    });


    // 初始化加载文地点
    var tempPointArr = pointData.filter(function (item) {
        // 过滤掉没有地理坐标的数据
        return item.basePoint !== null;
    });

    // 由于文地点数据是非geojson数据，所以遍历创建openlayers要素对象
    var pointArr = tempPointArr.map(function (item) {
        // item.basePoint:"113.1313, 39.39393" => [113.1313, 39.39393]
        var pointCoordArr = item.basePoint.split(',');

        return new ol.Feature(new ol.geom.Point(
            [Number(pointCoordArr[0]),Number(pointCoordArr[1])]
        ))
    });

    // 设置source
    var pointSource = new ol.source.Vector({
        features: pointArr
    });

    // 创建layer
    var cultural_point = new ol.layer.Vector({
        source: pointSource,
        zIndex: 4,                                // 设置图层显示顺序，0是最底层，数字越大图层越靠上
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

    // 地图上添加图层
    map.addLayer(cultural_point);



    /**
     * 请求西安底图geojson
     * render             传入地图渲染函数renderMap()
     *
     * */
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

    /**
     * 请求文地块geojson
     * render             传入地图渲染函数renderCulturalMap()
     *
     * */
    function getCulturalMap(render) {
        $.ajax({
            type:"get",
            url:"/getMapData",
            data: {mapId: 3},
            dataType:"json",
            success: function(res){
                cultural_mapData = res;
                render(res);
            }
        });
    }
    /**
     * 请求文地点数据
     * areas              区域筛选的值
     * types              类型筛选的值
     * render             传入地图渲染函数renderPoint()
     *
     * */
    function getPointData(areas, types, render, areaRender) {
        // 构造请求参数，在每一项上加单引号
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
            dataType: 'json',
            data: params,
            success: function (res) {
                console.log('文地点res==============',res);
                pointData = res.pointData;               // 返回数据由全局变量pointData接收，以便后续使用
                render(res.pointData, isShowImageIcon);
                areaRender(res.pointArea)
            }
        })
    }

    /**
     * 初次请求全部点数据
     * 框选初始化时请求该方法
     * areas              区域筛选的值
     * types              类型筛选的值
     *
     * */
    function getAllPointData(areas, types) {
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
            dataType: 'json',
            data: params,
            success: function (res) {
                allPointData = res;             // 返回数据由全局变量allPointData接收，以便框选使用
            }
        })
    }

    /**
     * 渲染相应的片区
     * data
     * */
    function renderAreaJson(data){
        if (areaJsonLayer !=null){
            map.removeLayer(areaJsonLayer);
        }
        var areaHighlight = new ol.style.Style({
            fill: new ol.style.Fill({               //填充样式
                color: 'rgba(255,255,255, 0.2)'
            }),
            stroke: new ol.style.Stroke({           //线样式
                color: 'rgba(0,255,255)',
                width: 2
            }),
            image: new ol.style.Circle({            //点样式
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            }),
            text: new ol.style.Text({
                font: '16px Calibri,sans-serif',
                fill: new ol.style.Fill({
                    color: '#000'
                })
            })
        });

        // 转换成片区geojson数据的集合
        var tempAreaJson = [];
        data.map(function (item) {
            // geoJson转成features 是一个数组
            var geoArr = (new ol.format.GeoJSON()).readFeatures(item);
            tempAreaJson = tempAreaJson.concat(geoArr)
        });
        areaJsonLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: tempAreaJson
            }),
            style: areaHighlight,
            zIndex: 1
        });
        map.addLayer(areaJsonLayer);
    }

    /**
     * 渲染西安底图
     * data               西安geojson数据
     *
     * */
    function renderMap (data) {
        console.log('data=====',data)
        console.log('xianJson=====',xianJson)
        // 创建矢量图层
        var vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(data)
            }),
            zIndex: 0
        });


        // 把图层加载到地图容器中
        map.addLayer(vectorLayer);
    }

    var xianJsonStyle = new ol.style.Style({
        fill: new ol.style.Fill({               //填充样式
            color: 'rgba(255,255,255, 0)'
        }),
        stroke: new ol.style.Stroke({           //线样式
            color: 'rgba(0,0,0)',
            width: 1
        }),
        image: new ol.style.Circle({            //点样式
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        }),
        text: new ol.style.Text({
            font: '16px Calibri,sans-serif',
            fill: new ol.style.Fill({
                color: '#000'
            })
        })
    });

    var xianJsonVectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: (new ol.format.GeoJSON()).readFeatures(xianJson)
        }),
        style: function (feature) {
            xianJsonStyle.getText().setText(feature.get('name'));
            return xianJsonStyle;
        },
        zIndex: 1
    });
    map.addLayer(xianJsonVectorLayer);

    /**
     * 渲染文地点
     * data               西安文地点数据
     * isShowIcon         是否显示图形化标注；true-显示，false-不显示
     *
     * */
    function renderPoint (data, isShowIcon) {
        // 每次渲染文地点前，清除之前的图层
        map.removeLayer(cultural_point);

        // 如果渲染前有点高亮，清除高亮样式
        if (highlight) {
            featureOverlay.getSource().removeFeature(highlight);
            overlay.setPosition(undefined);
            closer.blur();
            highlight = null;
        }

        // 创建点
        tempPointArr = data.filter(function (item) {
            return item.basePoint !== null;
        });

        // 判断是否显示图形化标注
        if (!isShowIcon){
            // 由于点击文地点需要显示点详细信息，所以在构造要素时，把文地点属性添加为要素的自定义属性
            pointArr = tempPointArr.map(function (item) {
                // item.basePoint:"113.1313, 39.39393" => [113.1313, 39.39393]
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
                zIndex: 4,
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
        } else {
            pointArr = tempPointArr.map(function (item) {
                // item.basePoint:"113.1313, 39.39393" => [113.1313, 39.39393]
                var pointCoordArr = item.basePoint.split(',');

                // 接收构造好的文地点要素对象
                var onePoint, twoPoint, threePoint, fourPoint, fivePoint , sixPoint = null;

                if (item.baseClassfication === '一类文地') {
                    var test1 = new ol.Feature({
                        geometry:  new ol.geom.Point([Number(pointCoordArr[0]),Number(pointCoordArr[1])]),
                        baseName: item.baseName,
                        baseArea: item.baseArea,
                        baseDistrict: item.baseDistrict,
                        baseClassfication: item.baseClassfication

                    });

                    // 为要素设置样式
                    test1.setStyle(new ol.style.Style({
                        image: new ol.style.Icon({
                            src: '../../static/icons/文化精神标识用地.png'
                        })
                    }));
                    onePoint =test1;
                } else if (item.baseClassfication === '二类文地'){
                    var test2 = new ol.Feature({
                        geometry:  new ol.geom.Point([Number(pointCoordArr[0]),Number(pointCoordArr[1])]),
                        baseName: item.baseName,
                        baseArea: item.baseArea,
                        baseDistrict: item.baseDistrict,
                        baseClassfication: item.baseClassfication

                    });
                    test2.setStyle(new ol.style.Style({
                        image: new ol.style.Icon({
                            src: '../../static/icons/纪念用地.png'
                        })
                    }));
                    twoPoint = test2;
                } else if (item.baseClassfication === '三类文地') {
                    var test3 = new ol.Feature({
                        geometry:  new ol.geom.Point([Number(pointCoordArr[0]),Number(pointCoordArr[1])]),
                        baseName: item.baseName,
                        baseArea: item.baseArea,
                        baseDistrict: item.baseDistrict,
                        baseClassfication: item.baseClassfication

                    });
                    test3.setStyle(new ol.style.Style({
                        image: new ol.style.Icon({
                            src: '../../static/icons/宗教用地.png'
                        })
                    }));
                    threePoint = test3;
                } else if (item.baseClassfication === '四类文地') {
                    var test4 = new ol.Feature({
                        geometry:  new ol.geom.Point([Number(pointCoordArr[0]),Number(pointCoordArr[1])]),
                        baseName: item.baseName,
                        baseArea: item.baseArea,
                        baseDistrict: item.baseDistrict,
                        baseClassfication: item.baseClassfication

                    });
                    test4.setStyle(new ol.style.Style({
                        image: new ol.style.Icon({
                            src: '../../static/icons/遗产用地.png'
                        })
                    }));
                    fourPoint = test4;
                } else if (item.baseClassfication === '五类文地') {
                    var test5 = new ol.Feature({
                        geometry:  new ol.geom.Point([Number(pointCoordArr[0]),Number(pointCoordArr[1])]),
                        baseName: item.baseName,
                        baseArea: item.baseArea,
                        baseDistrict: item.baseDistrict,
                        baseClassfication: item.baseClassfication

                    });
                    test5.setStyle(new ol.style.Style({
                        image: new ol.style.Icon({
                            src: '../../static/icons/文化设施用地.png'
                        })
                    }));
                    fivePoint = test5;
                } else {
                    var test6 = new ol.Feature({
                        geometry:  new ol.geom.Point([Number(pointCoordArr[0]),Number(pointCoordArr[1])]),
                        baseName: item.baseName,
                        baseArea: item.baseArea,
                        baseDistrict: item.baseDistrict,
                        baseClassfication: item.baseClassfication

                    });
                    test6.setStyle(new ol.style.Style({
                        image: new ol.style.Icon({
                            src: '../../static/icons/文化产业.png'
                        })
                    }));
                    sixPoint = test6;
                }

                // 按类别返回文地点要素的集合
                return item.baseClassfication === '一类文地' ? onePoint : item.baseClassfication === '二类文地' ? twoPoint:
                    item.baseClassfication === '三类文地' ? threePoint : item.baseClassfication === '四类文地' ? fourPoint:
                        item.baseClassfication === '五类文地' ? fivePoint : sixPoint;
            });

            // 过滤掉空的文地点
            var finalPointArr = pointArr.filter(function (value) {
                return value !== null;
            });
            console.log('pointArr=====', pointArr);
            console.log('finalPointArr=====', finalPointArr)
            pointSource = new ol.source.Vector({
                features: finalPointArr
            });

            cultural_point = new ol.layer.Vector({
                source: pointSource,
                zIndex: 4
            });
        }


        // 地图根据文地点范围显示
        // [2,6,4,23,9].sort(function(a, b){ return b - a });    返回[23,9,6,4,2]

        var test = [2,6,4,23,9].sort(function(a, b){ return b - a });
        console.log('test===',test)
        // 按经度由大到小排序
        var mLngPoint = tempPointArr.sort(function (a, b) {
            var tempLngA = Number(a.basePoint && a.basePoint.split(',')[0]),
                tempLngB = Number(b.basePoint && b.basePoint.split(',')[0]);
            return tempLngB - tempLngA
        });
        console.log('mLngPoint=====', mLngPoint)
        // 取经度最大最小值
        var maxLng = mLngPoint[0].basePoint.split(',')[0],
            minLng = mLngPoint[mLngPoint.length - 1].basePoint.split(',')[0];

        // 按纬度由大到小排序
        var mLatPoint =tempPointArr.sort(function (a, b) {
            var tempLatA = Number(a.basePoint && a.basePoint.split(',')[1]),
                tempLatB = Number(b.basePoint && b.basePoint.split(',')[1]);
            return tempLatB - tempLatA
        });
        // 取纬度最大最小值
        var maxLat = mLatPoint[0].basePoint.split(',')[1],
            minLat = mLatPoint[mLatPoint.length - 1].basePoint.split(',')[1]

        // 拼装一个矩形框，作为显示范围
        var topLeft = [minLng, maxLat],
            topRight = [maxLng, maxLat],
            bottomLeft = [minLng, minLat],
            bottomRight = [maxLng, minLat];

        var coorMaxBox = [topLeft, topRight, bottomRight, bottomLeft];
        var coorMaxBoxFeature = new ol.Feature({
            geometry: new ol.geom.Polygon([coorMaxBox])
        });

        // 添加一个透明图层，来盛放矩形框
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
        var size = map.getSize();

        // view.fit()方法进行缩放
        view.fit(polygon,size,{padding:[300,300,300,150],constrainResolution: false})

        map.addLayer(cultural_point)
    }

    // 渲染文地块
    function renderCulturalMap () {
        var cultural_vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(cultural_mapData)
            }),
            zIndex: 2,
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

    // 初始化加载所需图层
    getMapGeoJson(renderMap);
    getPointData("'全部'", "'全部'", renderPoint, renderAreaJson);
    getAllPointData("'全部'", "'全部'");
    // getCulturalMap(renderCulturalMap);



    /** 复选框部分
     *
     * 封装的获取复选框值得方法
     * type                      string  'area-districts':获取区域复选框的值；'area-types':获取类型复选框的值
     *
     * */
    function valChange (type) {
        var tempArr = $('input[class="'+type+'"]:checked') && $('input[class="'+type+'"]:checked').map(function (index, item) {
            return item.value;
        });
        // $取到的是jquery对象，无法直接使用数组的一些方法，通过$.makeArray()转化为普通的数组
        return $.makeArray(tempArr)
    }

    // 区域复选点击事件
    $('.area-districts').on('click',function (e) {
        var poi=$('#POI').val();

        // 搜索框无输入时，可进行操作
        if(poi === null || poi === "" || poi === undefined){
            var areaCheckedVal = valChange('area-districts');
            var typeCheckedVal = valChange('area-types');

            getAreaData(areaCheckedVal,typeCheckedVal)
            console.log('点击区域复选参数===========================',areaCheckedVal,typeCheckedVal);

            var types = typeCheckedVal.length === 6 || typeCheckedVal === 0? "'全部'" : typeCheckedVal;

            // 控制复选框和全选的操作联动
            if (areaCheckedVal.length === 7) {
                $('#area-all').prop('checked', true);
                getPointData("'全部'", types, renderPoint, renderAreaJson)
            } else if (areaCheckedVal.length === 0) {
                $('#area-all').prop('checked', false);
                getPointData("'全部'",types, renderPoint, renderAreaJson)
            } else {
                $('#area-all').prop('checked', false);
                getPointData(areaCheckedVal, types, renderPoint, renderAreaJson)
            }
        }
    });

    // 类型复选点击事件
    $('.area-types').on('click',function (e) {
        var areaCheckedVal = valChange('area-districts');
        var typeCheckedVal = valChange('area-types');

        getAreaData(areaCheckedVal,typeCheckedVal);
        console.log('点击类型复选参数===========================',areaCheckedVal,typeCheckedVal);

        var areas = areaCheckedVal.length === 7 || areaCheckedVal===0? "'全部'" : areaCheckedVal;
        // 控制复选框和全选的操作联动
        if (typeCheckedVal.length === 6) {
            $('#type-all').prop('checked', true);
            getPointData(areas, "'全部'", renderPoint, renderAreaJson)
        } else if (typeCheckedVal.length === 0) {
            $('#type-all').prop('checked', false);
            getPointData(areas,"'全部'", renderPoint, renderAreaJson)
        } else {
            $('#type-all').prop('checked', false);
            getPointData(areas,typeCheckedVal, renderPoint, renderAreaJson)
        }
    });

    // 区域全选
    $('#area-all').change(function () {
        var poi=$('#POI').val();
        var typeCheckedValTemp = valChange('area-types');
        if(poi === null || poi === "" || poi === undefined) {
            this.checked === false ? $('.area-districts').prop('checked', false) : $('.area-districts').prop('checked', true);
            var typeCheckedVal = typeCheckedValTemp && typeCheckedValTemp.length === 0 || typeCheckedValTemp.length === 6
                ? "'全部'" : typeCheckedValTemp;

            console.log('点击区域全选-类型传参==============', typeCheckedVal)
            getPointData("'全部'", typeCheckedVal, renderPoint, renderAreaJson);
            getAreaData(valChange('area-districts'),valChange('area-types'));
        }
        else {
            this.checked === false ? $('.area-districts').prop('checked', false) : $('.area-districts').prop('checked', true);
        }
    });

    // 类型全选
    $('#type-all').change(function () {
        var areaCheckedValTemp = valChange('area-districts');
        this.checked === false ? $('.area-types').prop('checked', false): $('.area-types').prop('checked', true);
        var areaCheckedVal = areaCheckedValTemp &&　areaCheckedValTemp.length === 0 || areaCheckedValTemp.length === 7
            ? "'全部'" : areaCheckedValTemp;

        console.log('点击类型全选-区域传参==============',areaCheckedVal)
        getPointData(areaCheckedVal, "'全部'", renderPoint, renderAreaJson);
        getAreaData(valChange('area-districts'),valChange('area-types'));

    });

    // 初次加载默认全选
    (function defaultChecked(){
        $('.area-districts').prop('checked', true);
        $('.area-types').prop('checked', true);
        $('#area-all').prop('checked', true);
        $('#type-all').prop('checked', true);
        $('#searchType0').prop('checked', true);
    })();

    // POI搜索
    // 请求POI拿到文地数据
    function POISelect(searchType) {
        var poi=$('#POI').val();

        var areaCheckedVal = valChange('area-districts');
        var area=areaCheckedVal.map(function (item) {
            return "\'" + item + "\'"}).join(',')
        var params = {};
        if (searchType === "0"){
            params = {
                baseDistrict: area,
                baseName: poi
            }
            POISelectByName(params, renderPoint, renderAreaJson)
        } else {
            params = {
                baseGeo:poi
            }
            POISelectByAreaJson(params, renderPoint, renderAreaJson)
        }

    }
    // 通过名称搜索
    function POISelectByName(params, render, areaRender){
        $.ajax({
            type:"get",
            url:"/getSearchData",
            data: params,
            dataType:"json",
            success:function(res){
                pointData = res.pointData;
                render(res.pointData);
                areaRender(res.pointArea);
            }
        });
    }
    // 通过片区搜索
    function POISelectByAreaJson(params, render, areaRender){
        $.ajax({
            type:"get",
            url:"/getAreaSearchData",
            data: params,
            dataType:"json",
            success:function(res){
                pointData = res.pointData;
                render(res.pointData);
                areaRender(res.pointArea);
            }
        });
    }
    // 点击搜索，调用方法
    $('#POIName').on('click',function (){
        var searchType = $('input[type="radio"]:checked').val();
        POISelect(searchType);
    });
    // 改变焦点 类别变暗
    $("#POI").on('input propertychange',function(){
        var poi=$('#POI').val();
        if(!(poi == null || poi === "" || poi === undefined)) {
            $('.area-types').prop("disabled",true);
            $('#type-all').prop("disabled",true);
        }
        else {
            $('.area-types').prop("disabled",false);
            $('#type-all').prop("disabled",false);
        }
    });


    /**
     * 添加信息窗体
     *
     * */
        // 获取弹出窗DOM节点
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    // 创建信息窗体叠加层
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
        featureOverlay.getSource().removeFeature(highlight);  // 清除高亮样式
        highlight = null;
        return false;
    };
    map.addOverlay(overlay);


    // 设置高亮样式
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

    // 添加用于高亮显示的图层
    var featureOverlay = new ol.layer.Vector({
        source: new ol.source.Vector(),
        map: map,
        style: highlightStyle
    });

    // 鼠标在地图上的单击事件
    map.on('click', function(evt) {
        // 获取鼠标点击的要素
        var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            console.log('feature============',feature);
            return feature;
        });
        if (feature) {
            // 通过点击的要素是否有baseName来判断是否显示信息窗体，而且还可以通过这个判断点击的是否是文地点
            var isShowInfo = true,
                hasName = feature && feature.get('baseName');
            hasName === undefined ? isShowInfo = false : isShowInfo = true;

            // 构造信息窗体结构
            var popContent = "<p class='pop-text'><b>文地名称：</b>" + feature.get('baseName') +
                "</p><p class='pop-text'><b>文地面积：</b>" + feature.get('baseArea') + "公顷" +
                "</p><p class='pop-text'><b>文地区域：</b>" + feature.get('baseDistrict') +
                "</p><p class='pop-text'><b>文地类型：</b>" + feature.get('baseClassfication') + "</p>";

            // 点击非高亮要素
            if (feature !== highlight) {
                // 判断是否是文地点
                if (isShowInfo){
                    // 如果已经有高亮的文地点，清除高亮
                    if (highlight) {
                        featureOverlay.getSource().removeFeature(highlight);
                    }

                    // 在高亮图层中添加上当前点击的文地点要素
                    featureOverlay.getSource().addFeature(feature);

                    var coordinates = feature.getGeometry().getCoordinates();
                    content.innerHTML = popContent;
                    overlay.setPosition(coordinates);

                    // highlight接收当前点击要素
                    highlight = feature;
                } else {
                    // 点击的不是文地点要素，如果地图上有高亮点，清除
                    if (highlight) {
                        featureOverlay.getSource().removeFeature(highlight);
                        overlay.setPosition(undefined);
                        closer.blur();
                        highlight = null;
                    }
                    return false
                }
            }
        }
        // else {
        //     if (highlight) {
        //         featureOverlay.getSource().removeFeature(highlight);
        //         overlay.setPosition(undefined);
        //         closer.blur();
        //         highlight = null;
        //     }
        //     return false
        // }

    });





    /**
     * 堆叠柱状图
     *
     * 基于准备好的dom，初始化echarts实例
     * */
    var myChart = echarts.init(document.getElementById('main'));

    // 指定图表的配置项和数据
    getAreaData(valChange('area-districts'),valChange('area-types'));

    /**
     * 请求不同类别不同区域面积数据
     * areas                        区域复选框的值  ['未央区','灞桥区','明城区','新城区','碑林区','莲湖区']
     * types                        类型复选框的值  ['一类文地','二类文地','三类文地','四类文地','五类文地','六类文地']
     * */
    function getAreaData(areas, types) {
        var params = {
            baseDistrict: areas === "'全部'" || areas.length===0? "'未央区','灞桥区','长安区','新城区','碑林区','雁塔区','莲湖区'" : areas.map(function (item) {
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
            dataType: 'json',
            data: params,
            success: function (data) {
                var area =data.map(function (item) {
                    return item.baseDistrict
                });
                console.log('地区的值==================================',area)
                console.log('类别的值==================================',types)

                var id_array = new Array();
                $('.area-types').each(function(){
                    id_array.push($(this).val());    //向数组中添加元素
                });

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
                                                    item === 'visualSixth' ? '六类文地': null,
                                type:'bar',
                                stack: '类别',
                                data: data.map(function (child) {
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

    /**
     * 鼠标框选事件
     *
     * */
        // 获取地图视框
    var viewport = map.getViewport();

    // 创建自定义控件按钮
    var controlContent = "<div id='draw-button' class='ol-control'><button id='draw-button-toggle' type='button'></button>" +
        "<ul id='draw-button-box'><li class='ol-control'><button type='button' name='Box'></button></li><li class='ol-control'><button type='button' name='Polygon'></button></li>" +
        "<li class='ol-control'><button type='button' name='None'></button></li></ul></div>";
    var iconControlContent = "<div id='icon-control' class='ol-control'><button type='button'></button><button type='button'></button></div>";

    // 把按钮添加到地图中
    $(viewport).append(controlContent);
    $(viewport).append(iconControlContent);

    $('#draw-button-toggle').bind('click', function (e) {
        e.preventDefault();
        map.removeLayer(cultural_point);     // 清空点图层

        $("#draw-button-box").slideToggle(1000,function () {
            var btnDisplay = $('#draw-button-box').css('display');

            // 点击框选，禁用复选框
            if (btnDisplay === 'block') {
                $('.area-districts').prop('disabled', true);
                $('.area-types').prop('disabled', true);
                $('#area-all').prop('disabled', true);
                $('#type-all').prop('disabled', true);
                isBoxSelect = true;   // 立一个flag，为图形化标注做准备
            } else {
                getPointData("'全部'", "'全部'", renderPoint);
                drawSource.clear();
                $('.area-districts').prop('disabled', false);
                $('.area-types').prop('disabled', false);
                $('#area-all').prop('disabled', false);
                $('#type-all').prop('disabled', false);
                $('.area-districts').prop('checked', true);
                $('.area-types').prop('checked', true);
                $('#area-all').prop('checked', true);
                $('#type-all').prop('checked', true);
                isBoxSelect = false;
            }
        });
    });

    // 点击绘制控件，把插件添加到地图上，可以绘制
    $('#draw-button-box li button').bind('click',function () {
        $this = $(this);

        map.removeInteraction(draw);
        drawSource.clear();
        map.removeLayer(cultural_point);
        addInteraction($this[0].name);
    });

    var draw;                                      //ol.Interaction.Draw类的对象
    var drawSource = new ol.source.Vector();
    var drawVectorLayer = new ol.layer.Vector({
        source: drawSource,
        zIndex: 3,
        style: new ol.style.Style({
            fill: new ol.style.Fill({               //填充样式
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({           //线样式
                color: 'rgba(0, 0, 153)',
                width: 2
            }),
            image: new ol.style.Circle({            //点样式
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });
    //将绘制层添加到地图容器中
    map.addLayer(drawVectorLayer);

    /**
     * 添加地图插件
     * typeName               Box:绘制长方形； Polygon:绘制多边形； None:清除绘制
     *
     * */
    function addInteraction(typeName){
        var type = typeName;
        if(type !== 'None'){
            var geometryFunction, maxPoints;
            if (type === 'Square') {                 //正方形
                type = 'Circle';                   //设置绘制类型为Circle
                // 设置几何信息变更函数，即创建正方形
                geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
            } else if (type === 'Box') {              //长方形
                type = 'Circle';                   //设置绘制类型为LineString
                maxPoints = 2;                     //设置最大点数为2
                // 设置几何信息变更函数，即设置长方形的坐标点
                geometryFunction = function(coordinates, geometry){
                    console.log('矩形================',coordinates,geometry)
                    if(!geometry){
                        geometry = new ol.geom.Polygon('Box');
                    }
                    var start = coordinates[0];
                    var end = coordinates[1];
                    geometry.setCoordinates([
                        [
                            start,
                            [start[0], end[1]],
                            end,
                            [end[0], start[1]],
                            start
                        ]
                    ]);
                    return geometry;    //多边形
                };
            }
            // 实例化图形绘制控件对象并添加到地图容器中
            draw = new ol.interaction.Draw({
                source: drawSource,
                type: type,                                     //几何图形类型
                geometryFunction: geometryFunction,             //几何信息变更时的回调函数
                maxPoints: maxPoints                            //最大点数
            });
            map.addInteraction(draw);

            //获取多边形的坐标
            draw.on('drawend',function (evt) {
                var feature =evt.feature;
                var coordinate = feature.getGeometry().getCoordinates();

                console.log('多边形的坐标是:', coordinate);

                // 创建点
                var tempPointArr = allPointData.filter(function (item) {
                    return item.basePoint !== null;
                });

                // 为显示信息窗体，添加自定义属性，pointCoor用于turf计算
                var pointArr = tempPointArr.map(function (item) {
                    var pointCoordArr = item.basePoint.split(',');
                    return {
                        pointCoor: [Number(pointCoordArr[0]),Number(pointCoordArr[1])],
                        basePoint: item.basePoint,
                        baseName: item.baseName,
                        baseArea: item.baseArea,
                        baseDistrict: item.baseDistrict,
                        baseClassfication: item.baseClassfication
                    }

                });
                console.log('这是文地点============', pointArr);

                var turfResult = pointArr.map(function (item) {
                    // turf.js计算出多边形内的点
                    var isShowPoint = turf.booleanPointInPolygon(turf.point(item.pointCoor), turf.polygon([coordinate[0]]));
                    if (isShowPoint){
                        return item;
                    }
                });
                var renderTurfResult = turfResult.filter(function (value) {
                    return value !== undefined;
                });

                // 框选结构赋值给全局变量，用于图形化标注显示
                boxSelectData = renderTurfResult;
                console.log('result============',renderTurfResult)
                renderPoint(renderTurfResult, isShowImageIcon);
                map.removeInteraction(draw)
            })
        }else{
            //清空绘制的图形
            drawSource.clear();
        }
    }

    /***
     * 图形化标注
     *
     * */
    $('#legend').hide()
    // 普通标注按钮;
    $('#icon-control button:first-child').bind('click', function () {
        $('#legend').hide()
        isShowImageIcon = false;
        isBoxSelect ? renderPoint(boxSelectData, isShowImageIcon) : renderPoint(pointData,isShowImageIcon);
    });
    // 图形化标注按钮
    $('#icon-control button:last-child').bind('click', function () {
        $('#legend').show()
        isShowImageIcon = true;
        isBoxSelect ? renderPoint(boxSelectData, isShowImageIcon) : renderPoint(pointData,isShowImageIcon);
    })

});