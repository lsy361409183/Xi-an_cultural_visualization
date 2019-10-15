define(function(require, exports, module) {

    var map = new AMap.Map('accessin', {
        zoom: 12,//缩放级别
        resizeEnable: true,
        center: [108.948273, 34.275896]
    });

//引入热力图
    // 坐标点
    var points =[
        // longitude 经度

        {"lng":108.832415,"lat":34.30939,"count":98},



    ];

    var heatmap;
    map.plugin(["AMap.Heatmap"], function() {
        //初始化heatmap对象
        heatmap = new AMap.Heatmap(map, {
            radius: 100, //给定半径(热力图显示的圆点的半径)
            opacity: [0, 0.8],
            /*,gradient:{
             0.5: 'blue',
             0.65: 'rgb(117,211,248)',
             0.7: 'rgb(0, 255, 0)',
             0.9: '#ffea00',
             1.0: 'red'
             }*/
            gradient:{          //热力图的颜色渐变区间。   {JSON}:key 插值的位置, 0-1;  value颜色值
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
            max: 100
        });
    });


})