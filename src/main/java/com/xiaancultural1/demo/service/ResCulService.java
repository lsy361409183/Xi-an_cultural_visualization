package com.xiaancultural1.demo.service;

import com.xiaancultural1.demo.mapper.ResCulMapper;
import com.xiaancultural1.demo.pojo.CultureLand;
import com.xiaancultural1.demo.pojo.ResArea;
import com.xiaancultural1.demo.utils.MapUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static java.lang.Math.E;

@Service
public class ResCulService {
    @Autowired
    private ResCulMapper resCulMapper;

    public List<CultureLand> selectAllCul(){
        return resCulMapper.selectAllCul();
    }

    public List<ResArea> selectAllRes(){
        return resCulMapper.selectAllRes();
    }

    public List<ResArea> selectAllAccRes(){
        //新建一个文地List与一个小区List
        List<CultureLand> CultureLandList = resCulMapper.selectAllCul();
        List<ResArea> ResAreaList = resCulMapper.selectAllRes();

//        CultureLand CultureLand1 = new CultureLand(0, "文地1", "旅游用地", 34.302558, 108.841037, "长安区", 0.03, 0.0);
//        CultureLand CultureLand2 = new CultureLand(1, "文地2", "文化用地", 34.364937, 108.957168, "雁塔区", 1.27, 0.0);
//        ResArea ResArea1 = new ResArea(0, "小区1", 34.30939, 108.832415, 30, 20856);
//        ResArea ResArea2 = new ResArea(1, "小区2", 34.311525, 108.825542, 23, 178);
//
//        CultureLandList.add(0, CultureLand1);
//        CultureLandList.add(1, CultureLand2);
//        ResAreaList.add(0, ResArea1);
//        ResAreaList.add(1, ResArea2);
//        //读数据就写在这里
//        //然后吧啦吧啦读取一群信息，现在有了文地和小区的数据，已经封装成数组了。
//        //上面的代码完成了数据读取的功能，实际开发应该从表中查询出数据，然后读取到List里面，循环读取即可。读数据结束。


        //新建一个List，里面装计算出的每个文地的供需比（暂时定为数字），属于中间变量，我认为还是存比较好
        ArrayList<Double> SDRatio = new ArrayList<Double>();

        //新建一个二维List，存储Wr信息（一个文地与一个点之间有一个数字），属于中间变量，可以存也可以不存
        ArrayList<ArrayList> WrOuter = new ArrayList<ArrayList>();

        for (int j = 0; j < CultureLandList.size(); j++) {
            //先获取当前文地点的经纬度属性与服务半径属性
            double lat = CultureLandList.get(j).getCuLat();
            double lon = CultureLandList.get(j).getCuLon();
            double serviceCapability = CultureLandList.get(j).getCuServiceCap();

            //定义一个List,我也没看懂这个List的WrCount属性有什么用,应该是这个第k个居民区的权重值
            ArrayList<Double> WrCount = new ArrayList<Double>();
            //建立针对这一文地的加权和属性，用于计算加权和
            double weightedSum = 0;
            for (int k = 0; k < ResAreaList.size(); k++) {

                double lat1 = ResAreaList.get(k).getJmLatitude();
                double lon1 = ResAreaList.get(k).getJmLongitude();
                int people = ResAreaList.get(k).getJmPeople();
                double weights = 0.00000000000000000000000000000;
                //计算了Wr数字，是当前文地点与居民区的距离,Wr是经纬度表示，Wr1是距离表示，两者都暂时保留
                double Wr = Math.sqrt(Math.pow(lat - lat1, 2) + Math.pow(lon - lon1, 2));
                double Wr1 = MapUtils.algorithm(lon, lat, lon1, lat1);
//                System.out.println(Wr);
//                System.out.println(Wr1);

                if (Wr1 < 600) {
                    weights = 1;
                    weightedSum = weightedSum + people * weights;//600米以内权值设为1
                    BigDecimal bigDecimal = new BigDecimal(Double.toString(weightedSum));
                    weightedSum=bigDecimal.doubleValue();
                  //  System.out.println("小于600的权重为"+weights+"的第"+k+"个居民区权重值为"+weightedSum);
                } else if (Wr1 > 1500) {
                    weights = 0;
                    weightedSum = weightedSum + people * weights;//1500米以外权值为0，计算时相当于不叠加保持不变
                    BigDecimal bigDecimal = new BigDecimal(Double.toString(weightedSum));
                    weightedSum=bigDecimal.doubleValue();
                   // System.out.println("大于1500的权重为"+weights+"的第"+k+"个居民区权重值为"+weightedSum);
                } else {
                    weights = (StrictMath.pow(E, (-0.5 * Math.pow(((Wr1 - 600) / 900),2))) - (StrictMath.pow(E, -0.5))) / (1 - StrictMath.pow(E, -0.5));
                    weightedSum = weightedSum + people * weights;
                    BigDecimal bigDecimal = new BigDecimal(Double.toString(weightedSum));
                    weightedSum=bigDecimal.doubleValue();
                  //  System.out.println("介于600到1500的权重为"+weights+"的第"+k+"个居民区权重值为"+weightedSum);
                    //System.out.println((Math.pow(E, (-0.5 * Math.pow(((Wr1 - 600) / 900),2))) )+"权值");
                }
                //在经过三种条件判断具体的权重值以后，使用WrCount数组记录当前居民区的序号和权重
                WrCount.add(k, weights);
                //System.out.println(weights+"这是当前居民点的权重值");
            }
            //这是每个文地会有的值，供需比，也是第一步计算返回的结果
            double R = serviceCapability / weightedSum;
            //System.out.println(R+"：这是当前第"+j+"个文地供需比的值");
            //使用SDRatio属性来存储当前文地的序号与供需比的数值。
            SDRatio.add(j, R);//存储文地的供需比（每个文地一个）

            //WrOuter是二维数组，相当于存储了当前文地、当前居民区的序号，以及对应的权重，j个文地，k个小区，第一层取文地，第二层取小区
            WrOuter.add(j, WrCount);

        }
//        for (int i = 0; i < SDRatio.size(); i++) {
//            System.out.println(SDRatio.get(i)+"这是第"+i+"个文地的供需比");
//        }
//        for (int i = 0; i < WrOuter.size(); i++) {
//            for (int j = 0; j < WrOuter.get(2).size(); j++) {
//                System.out.println(WrOuter.get(i).get(j)+"此操作取出当前第"+i+"个文地点,第"+j+"个居民区的权重");
//            }
//        }

        //第一步至此完全结束，获得了供需比的数值
        //最后返回的应该是个居民区对象的数组（有经纬度，有可达性结果值）
        //所以在此新建数组，来存储新构建的居民区对象
        List<ResArea> ResAreaAfterList = new ArrayList<>();
        //原理是，再次二重循环，以居民区出发
        for (int i = 0; i < ResAreaList.size(); i++) {
            //新建一个变量，用来存储该居民区的空间可达性
            double AFcount = 0;
            //每次循环到一个新的居民区时，新建一个新的居民区对象
            ResArea ResAreaAfter = new ResArea();
            //再次循环文地点
            for (int z = 0; z < CultureLandList.size(); z++) {
                //循环到第z个文地时，取出文地对应的SDRatio,然后取出对应的权重值
                double weights1 = (SDRatio.get(z)) * ((double) WrOuter.get(z).get(i));
              //  System.out.println(SDRatio.get(z)+"这是SDRATIO");
               // System.out.println(weights1+"这是第"+i+"次取出来的数");
                //该居民区的空间可达性是一个累计量，所以每循环一次都要加一下
                if(Double.isNaN(weights1)) {
                    weights1=0;
                    AFcount=AFcount+weights1;
                }else
                {
                    AFcount = AFcount + weights1;
                }
            }
            AFcount=AFcount*100000000;
            //新的居民区对象里添加对应的属性
            ResAreaAfter.setJmAF(AFcount);
            System.out.println(ResAreaAfter.getJmAF()+"这是第"+i+"个小区的可达性");
            ResAreaAfter.setJmLatitude(ResAreaList.get(i).getJmLatitude());
            ResAreaAfter.setJmLongitude(ResAreaList.get(i).getJmLongitude());
            ResAreaAfter.setJmName(ResAreaList.get(i).getJmName());
            ResAreaAfter.setJmId(ResAreaList.get(i).getJmId());
            ResAreaAfter.setJmPeople(ResAreaList.get(i).getJmPeople());
            //新的居民区列表里添加这一个新对象
            ResAreaAfterList.add(i, ResAreaAfter);
        }

        return ResAreaAfterList;
    }

}
