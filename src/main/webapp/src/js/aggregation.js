function setMapHeight() {
    var clientHeight = $(window).height();
    var clientWidth = $(window).width();
    // 获取导航高度
    var nav_height = $('#nav-tpl').height();

    var map_container = $('.aggregation-content');

    var draw_left_width = $('.aggregation-content .draw-left');
    var square_width = $('.aggregation-content #square').width();

    map_container.css('height', (clientHeight - nav_height)+'px');
    draw_left_width.css('width', (clientWidth - square_width)+'px');
}
setMapHeight();
// 浏览器高度变化时
$(window).resize(function () {
    setMapHeight();
});
var pointsData = [];
var cluster, markers = [];
var map = new AMap.Map("KNNMap", {
    resizeEnable: true,
    center: [108.948204,34.275512],
    zoom: 11,
    zooms:[10,13],
    zoomEnable:true
});
var geojson = new AMap.GeoJSON({
    geoJSON: xianJson,
    // 还可以自定义getMarker和getPolyline
    getPolygon: function(geojson, lnglats) {
        // 计算面积
        var area = AMap.GeometryUtil.ringArea(lnglats[0])

        return new AMap.Polygon({
            path: lnglats,
            fillOpacity: 1 - Math.sqrt(area / 8000000000),// 面积越大透明度越高
            strokeColor: 'white',
            fillColor: 'rgba(145,199,174, .4)'
        });
    }
});

geojson.setMap(map);

function getPointData(areas, types) {
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
            pointsData = res.pointData;
            for (var i = 0; i < pointsData.length; i++) {
                if (pointsData[i].basePoint !== null){
                    console.log('basePoint=====', [pointsData[i].basePoint.split(',')[0], pointsData[i].basePoint.split(',')[1]])
                    markers.push(new AMap.Marker({
                        position: [pointsData[i].basePoint.split(',')[0], pointsData[i].basePoint.split(',')[1]],
                        content: '<div style="background-color: rgb(255,0,0); height: 12px; width: 12px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
                        offset: new AMap.Pixel(-15, -15)
                    }))
                    console.log('makers====',markers)
                }
            }
            addCluster();
        }
    });
}
getPointData("'全部'","'全部'");

var _renderClusterMarker = function (context) {
    var count = markers.length;
    var factor = Math.pow(context.count / count, 1 / 18);
    console.log('factor======', factor);
    var div = document.createElement('div');
    var Hue = 360 - (factor * 360);
    var bgColor = 'hsla(' + Hue + ',100%,50%,0.8)';
    var fontColor = 'hsla(' + Hue + ',100%,20%,1)';
    var borderColor = 'hsla(' + Hue + ',100%,40%,1)';
    var shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
    div.style.backgroundColor = bgColor;
    var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 60);
    div.style.width = div.style.height = size + 'px';
    div.style.border = 'solid 1px ' + borderColor;
    div.style.borderRadius = size / 2 + 'px';
    div.style.boxShadow = '0 0 1px ' + shadowColor;
    div.innerHTML = context.count;
    div.style.lineHeight = size + 'px';
    div.style.color = fontColor;
    div.style.fontSize = '14px';
    div.style.textAlign = 'center';
    context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
    context.marker.setContent(div)
};
function addCluster() {
    if (cluster) {
        cluster.setMap(null);
    }

    // cluster = new AMap.MarkerClusterer(map, markers, {gridSize: 80});
    cluster = new AMap.MarkerClusterer(map, markers, {
        gridSize: 80,
        renderClusterMarker: _renderClusterMarker
    });
}

