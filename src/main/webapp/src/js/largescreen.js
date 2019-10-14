define(function (require,exports, module) {
    var navTpl = require('../views/templates/navigation.tpl')
    var nav_container = $('#nav-tpl');
    nav_container.html(navTpl);


    var depth = 2;
    var map = new AMap.Map('Firstmap', {
        resizeEnable: true,
        center: [108.931711,34.277604],//西安坐标
        zoom: 4.5,
        pitch: 0,
        viewMode: '3D',
    });
    var marker= new AMap.Marker({
            // icon: '//vdata.amap.com/icons/b18/1/2.png', // 添加 Icon 图标 URL
            zIndex: 101,
            position: [108.931711,34.277604],
            offset: new AMap.Pixel(-13, -30),
            title:'陕西省',
        });
        map.add(marker);
        marker.setMap(map);
        //点击标签页进行页面跳转  （返回上一页面）window.history.back(-1);
        marker.on('click',function () {
            window.location.href="../../views/largescreen/secondhtml.html";
        })
    // 创建省份图层
    var disProvince;
    function initPro(code, dep) {
        dep = typeof dep == 'undefined' ? 2 : dep;
        adCode = code;
        depth = dep;
        disProvince && disProvince.setMap(null);
        disProvince = new AMap.DistrictLayer.Province({
            zIndex: 12,
            adcode: [code],
            depth: dep,
            styles: {
                'fill': function (properties) {
                    // properties为可用于做样式映射的字段，包含
                    // NAME_CHN:中文名称
                    // adcode_pro
                    // adcode_cit
                    // adcode
                    var adcode = properties.adcode;
                    return getColorByAdcode(adcode);
                },
                'province-stroke': 'cornflowerblue',
                'city-stroke': 'white', // 中国地级市边界
                'county-stroke': 'rgba(255,255,255,0.5)' // 中国区县边界
            }
        });
        disProvince.setMap(map);
    }
    //画陕西省的行政区划边界
    AMap.plugin('AMap.DistrictSearch', function () {
        // 创建行政区查询对象
        var district = new AMap.DistrictSearch({
            subdistrict: 0,   //获取边界不需要返回下级行政区
            // 返回行政区边界坐标等具体信息
            extensions: 'all',
            // 设置查询行政区级别为 区
            level: 'province'
        })
        district.search('陕西省', function(status, result) {
            // 获取边界信息
            var bounds = result.districtList[0].boundaries
            var polygons = []
            if (bounds) {
                for (var i = 0, l = bounds.length; i < l; i++) {
                    //生成行政区划polygon
                    var polygon = new AMap.Polygon({
                        map: map,
                        strokeWeight: 1,
                        path: bounds[i],
                        fillOpacity: 0.7,
                        fillColor: '#CCF3FF',
                        strokeColor: '#CC66CC'
                    })
                    polygons.push(polygon)
                }
                // 地图自适应
                // map.setFitView()
            }
        })
    })
})