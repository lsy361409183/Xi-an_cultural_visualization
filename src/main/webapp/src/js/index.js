define(function (require, exports, module) {

        var map = new AMap.Map('accessin', {

            resizeEnable: true,
            center: [108.948273, 34.275896],
            zoom: 11

        });

    var heatmap;

            $.ajax({
                    type: "get",
                    url: "/res",
                    // async:true,
                    dataType: 'json',
                    success: function (res) {
                        map.plugin(["AMap.Heatmap"], function () {
                            //初始化heatmap对象
                            heatmap = new AMap.Heatmap(map, {
                                radius: 50, //给定半径
                                opacity: [0, 1],
                                gradient:{
                                    // 0.1: '#ff0000',
                                    // 0.2: '#ff5511',
                                    0.3: '#ff0000',
                                    0.4: '#ffbb00',
                                    0.5: '#ffff00',
                                    0.9: '#bbff00',
                                    0.95: '#77ff00',
                                    0.98: '#00ff00',
                                    1.0: '#00ff99'
                                }
                            });
                            var list = [];
                            var i = -1;
                            var length = res.length;
                            console.log(res);


                            console.log(length);
                            while (++i < length) {

                                var item = res[i];
                                list.push({
                                        // coordinate: [item.jmLongitude, item.jmLatitude],
                                        lng:item.jmLongitude,
                                        lat:item.jmLatitude,
                                        count: item.jmAF,
                                    })

                            }
                            console.log(list)
                            //设置数据集：该数据为北京部分“公园”数据
                            heatmap.setDataSet({
                                data: list,
                                max:300
                            });

                            });


                    }
                }



            );





    }
)