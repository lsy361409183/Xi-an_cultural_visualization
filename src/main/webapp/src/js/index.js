define(function (require, exports, module) {

        let map = new AMap.Map('accessin', {

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
                                radius: 110, //给定半径
                                opacity: [0, 0.8],
                                gradient:{
                                    0.5: 'rgb(131,171,155)',
                                    0.55: 'rgb(200,200,169)',
                                    0.6: 'rgb(249, 205, 173)',
                                    0.8: '#ffea00',
                                    1.0: 'rgb(254,67,101)'
                                }
                            });
                            let list = [];
                            let i = -1;
                            let length = res.length;
                            console.log(res);


                            console.log(length);
                            while (++i < length) {

                                let item = res[i];
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