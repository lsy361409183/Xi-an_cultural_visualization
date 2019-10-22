define(function(require, exports, module) {

    var map = new AMap.Map('wrapper', {
        zoom: 11,//缩放级别
        resizeEnable: true,
        center: [108.948273, 34.275896]
    });
    var map2 = new AMap.Map('wrapper2', {
        zoom: 11,//缩放级别
        resizeEnable: true,
        center: [108.948273, 34.275896]
    });
    var map3 = new AMap.Map('wrapper3', {
        zoom: 11,//缩放级别
        resizeEnable: true,
        center: [108.948273, 34.275896]
    });
    var map4 = new AMap.Map('wrapper4', {
        zoom: 11,//缩放级别
        resizeEnable: true,
        center: [108.948273, 34.275896]
    });

    setMapHeight();
    //设置地图边框大小
    //监听浏览器宽度的改变
    window.onresize = function(){
        setMapHeight();
    };
    function setMapHeight(){
        //地图容器
        var map_container =$('#map_container');
        var clientWidth = $(window).width();
        var clientHeight = $(window).height();
        var s_height = $('#square').height();
        var s_width = $('#square').width();
        // 获取导航高度
        var nav_height = $('#nav-tpl').height();
        map_container.css('height',(clientHeight-nav_height)+'px');
        map_container.css('width',(clientWidth-s_width)+'px');
        //第一张图
        var map = $('#wrapper');
        var map_container_height =$('#map_container').height();
        var map_container_width =$('#map_container').width();
        map.css('width',(map_container_width-20)/2+'px');
        map.css('height',(map_container_height/2)+'px');
        console.log(map_container_height)
        //第二张图
        var map2=$('#wrapper2');
        map2.css('width',(map_container_width-20)/2+'px');
        map2.css('height', (map_container_height/2)+'px');
        //第三张图
        var map3=$('#wrapper3');
        map3.css('width',(map_container_width-20)/2+'px');
        map3.css('height', (map_container_height/2-20)+'px');
        //第四张图
        var map4=$('#wrapper4');
        map4.css('width',(map_container_width-20)/2+'px');
        map4.css('height', (map_container_height/2-20)+'px');
        //修改右边长方形的高度
        var ss = $('#square');
        ss.css('height',(clientHeight-nav_height)+'px');

    }
    $("#drawing").click(function(){
        Drawing();
    });


function Drawing() {
        console.log(1234)
//获取西安站的数据
    $.ajax({
        type: 'post',
        url: '/getTrafficData',
        dataType: 'json',
        success: function (data) {
            var point = data.map(function (item) {
                return item.basePoint
            });
            var count = data.map(function (item) {
                return item.accessibility
            })
            var lon = data.map(function (item) {
                return item.baseLongitude
            })
            var lat = data.map(function (item) {
                return item.baseLatitude
            })
            console.log("可达性：" + count + "经度：" + lon + "纬度" + lat)


            //引入热力图
            // 坐标点
            var points =
                // {"lng":0,"lat":0,"count":0},
                // {"lng":0,"lat":0,"count":0},
                // {"lng":108.841037,"lat":34.302558,"count":10068},
                // {"lng":109.011909,"lat":34.325429,"count":11090},
                // {"lng":109.056604,"lat":34.395023,"count":15040},
                data.map(function (item) {
                    return {
                        "lng": item.baseLongitude === null ? 0 : item.baseLongitude,
                        "lat": item.baseLatitude === null ? 0 : item.baseLatitude,
                        "count": item.accessibility === null ? 0 : item.accessibility
                    }
                });

            var heatmap;
            map.plugin(["AMap.Heatmap"], function () {
                //初始化heatmap对象
                heatmap = new AMap.Heatmap(map, {
                    radius: 50, //给定半径(热力图显示的圆点的半径)
                    opacity: [0, 0.8],
                    /*,gradient:{
                     0.5: 'blue',
                     0.65: 'rgb(117,211,248)',
                     0.7: 'rgb(0, 255, 0)',
                     0.9: '#ffea00',
                     1.0: 'red'
                     }*/
                    gradient: {          //热力图的颜色渐变区间。   {JSON}:key 插值的位置, 0-1;  value颜色值
                        0.5: '#50a3ba',
                        0.65: '#9DB578',
                        0.7: '#eac736',
                        0.9: '#E28B40',
                        1.0: '#d94e5d'
                    }
                });
                //设置数据集：该数据为重庆景点数据
                heatmap.setDataSet({
                    data: points,
                    max: 20000
                });
            });

        }
    })

    //获取西安南站的数据
    $.ajax({
        type: 'post',
        url: '/getTrafficData1',
        dataType: 'json',
        success: function (data) {
            // var point = data.map(function (item) {
            //     return item.basePoint
            // });
            // var count = data.map(function (item) {
            //     return item.accessibility
            // })
            // var lon = data.map(function (item) {
            //     return item.baseLongitude
            // })
            // var lat = data.map(function (item) {
            //     return item.baseLatitude
            // })
            //console.log("可达性："+count+"经度："+lon+"纬度"+lat)


            //引入热力图
            // 坐标点
            var points =
                data.map(function (item) {
                    return {
                        "lng": item.baseLongitude === null ? 0 : item.baseLongitude,
                        "lat": item.baseLatitude === null ? 0 : item.baseLatitude,
                        "count": item.accessibility === null ? 0 : item.accessibility
                    }
                });

            var heatmap;
            map2.plugin(["AMap.Heatmap"], function () {
                //初始化heatmap对象
                heatmap = new AMap.Heatmap(map2, {
                    radius: 50, //给定半径(热力图显示的圆点的半径)
                    opacity: [0, 0.8],
                    /*,gradient:{
                     0.5: 'blue',
                     0.65: 'rgb(117,211,248)',
                     0.7: 'rgb(0, 255, 0)',
                     0.9: '#ffea00',
                     1.0: 'red'
                     }*/
                    gradient: {          //热力图的颜色渐变区间。   {JSON}:key 插值的位置, 0-1;  value颜色值
                        0.5: '#50a3ba',
                        0.65: '#9DB578',
                        0.7: '#eac736',
                        0.9: '#E28B40',
                        1.0: '#d94e5d'
                    }
                });
                //设置数据集：该数据为重庆景点数据
                heatmap.setDataSet({
                    data: points,
                    max: 20000
                });
            });

        }
    })
    //获取西安北站的数据
    $.ajax({
        type: 'post',
        url: '/getTrafficData2',
        dataType: 'json',
        success: function (data) {

            //引入热力图
            // 坐标点
            var points =
                data.map(function (item) {
                    return {
                        "lng": item.baseLongitude === null ? 0 : item.baseLongitude,
                        "lat": item.baseLatitude === null ? 0 : item.baseLatitude,
                        "count": item.accessibility === null ? 0 : item.accessibility
                    }
                });

            var heatmap;
            map3.plugin(["AMap.Heatmap"], function () {
                //初始化heatmap对象
                heatmap = new AMap.Heatmap(map3, {
                    radius: 50, //给定半径(热力图显示的圆点的半径)
                    opacity: [0, 0.8],
                    /*,gradient:{
                     0.5: 'blue',
                     0.65: 'rgb(117,211,248)',
                     0.7: 'rgb(0, 255, 0)',
                     0.9: '#ffea00',
                     1.0: 'red'
                     }*/
                    gradient: {          //热力图的颜色渐变区间。   {JSON}:key 插值的位置, 0-1;  value颜色值
                        0.5: '#50a3ba',
                        0.65: '#9DB578',
                        0.7: '#eac736',
                        0.9: '#E28B40',
                        1.0: '#d94e5d'
                    }
                });
                //设置数据集：该数据为重庆景点数据
                heatmap.setDataSet({
                    data: points,
                    max: 20000
                });
            });

        }
    })
//获取机场的数据
    $.ajax({
        type: 'post',
        url: '/getTrafficData3',
        dataType: 'json',
        success: function (data) {

            //引入热力图
            // 坐标点
            var points =
                data.map(function (item) {
                    return {
                        "lng": item.baseLongitude === null ? 0 : item.baseLongitude,
                        "lat": item.baseLatitude === null ? 0 : item.baseLatitude,
                        "count": item.accessibility === null ? 0 : item.accessibility
                    }
                });

            var heatmap;
            map4.plugin(["AMap.Heatmap"], function () {
                //初始化heatmap对象
                heatmap = new AMap.Heatmap(map4, {
                    radius: 50, //给定半径(热力图显示的圆点的半径)
                    opacity: [0, 0.8],
                    /*,gradient:{
                     0.5: 'blue',
                     0.65: 'rgb(117,211,248)',
                     0.7: 'rgb(0, 255, 0)',
                     0.9: '#ffea00',
                     1.0: 'red'
                     }*/
                    gradient: {          //热力图的颜色渐变区间。   {JSON}:key 插值的位置, 0-1;  value颜色值
                        0.5: '#50a3ba',
                        0.65: '#9DB578',
                        0.7: '#eac736',
                        0.9: '#E28B40',
                        1.0: '#d94e5d'
                    }
                });
                //设置数据集：该数据为重庆景点数据
                heatmap.setDataSet({
                    data: points,
                    max: 20000
                });
            });

        }
    })
}

})