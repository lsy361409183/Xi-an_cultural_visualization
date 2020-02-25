package com.xiaancultural1.demo.service;

import com.xiaancultural1.demo.mapper.TrafficMapper;
import com.xiaancultural1.demo.pojo.TrafficData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Random;

import static com.xiaancultural1.demo.controller.GetDistance.getDistance;
import static com.xiaancultural1.demo.controller.ImportKDE.getKDE;

@Service
public class TrafficService {
    @Autowired
    private TrafficMapper trafficMapper;
    //查询出所有的文地的经纬度点和可达性

    //西安站
    public List<TrafficData> selectPoint() {
        List<TrafficData> list = trafficMapper.selectPoint();
        List<TrafficData> after = new ArrayList<>();

            for (int i = 0; i < list.size(); i++) {
                TrafficData a = new TrafficData();
                String point = list.get(i).getBasePoint();
                Double dis = 0.00;
                String[] k={"b1c8c31729c23c2712acb0017eb915f6",
                        "10ac57c56404c6713bc970dc8b1192ca",
                        "57f8d8f793af2a1c5969aa4ea0160682"
                        };
                 //返回一个0~(指定数-1)之间的随机值
                Random random = new Random();
                int ran = random.nextInt(2);
                String key = k[ran];

                    if (point == null) {
                        dis = null;
                       // System.out.println("point为空");
                    } else {
                        String startLonLat = "108.961711,34.277604";
                        String endLonLat = point;
                       // System.out.println(startLonLat);
                        //System.out.println(endLonLat);
                        dis = getDistance(startLonLat, endLonLat, key);
                        //System.out.println(dis);
                    }
                     a.setAccessibility(dis);
                     a.setBaseName(list.get(i).getBaseName());
                     a.setBasePoint(point);
                     a.setBaseLongitude(list.get(i).getBaseLongitude());
                     a.setBaseLatitude(list.get(i).getBaseLatitude());
                     //System.out.println(a.getBaseName()+a.getBasePoint()+a.getAccessibility());
                     after.add(i,a);
//                      System.out.println("名称"+after.get(i).getBaseName()+","+"可达性"+after.get(i).getAccessibility());
                }
                 return after;
    }
    //西安南站
    public List<TrafficData> selectPoint1() {
        List<TrafficData> list1 = trafficMapper.selectPoint();
        List<TrafficData> after1 = new ArrayList<>();
        for (int j = 0; j < list1.size(); j++) {
            TrafficData a1 = new TrafficData();
            String point1 = list1.get(j).getBasePoint();
            Double dis1 = 0.00;
            String[] k1={"a6cf1b9378362a5e98a01dbd0dea44ab",
                    "595119ffba7b522251c3b003fd8a9670",
                    "1d54973156f6caa2a557dc5d6cdbea4c"
            };
            // 返回一个0~(指定数-1)之间的随机值
            Random random1 = new Random();
            int ran1 = random1.nextInt(2);
            String key1 = k1[ran1];
            if (point1 == null) {
                dis1 = null;
                // System.out.println("point为空");
            } else {
                String startLonLat1 = "109.101981,34.092766";
                String endLonLat1 = point1;
                // System.out.println(startLonLat);
                //System.out.println(endLonLat);
                dis1 = getDistance(startLonLat1, endLonLat1, key1);
                //System.out.println(dis);
            }
            a1.setAccessibility(dis1);
            a1.setBaseName(list1.get(j).getBaseName());
            a1.setBasePoint(point1);
            a1.setBaseLongitude(list1.get(j).getBaseLongitude());
            a1.setBaseLatitude(list1.get(j).getBaseLatitude());
            //System.out.println(a.getBaseName()+a.getBasePoint()+a.getAccessibility());
            after1.add(j,a1);
            System.out.println("名称"+after1.get(j).getBaseName()+"可达性"+after1.get(j).getAccessibility());
        }
//        System.out.println("名称"+after.get(0).getBaseName()+"可达性"+after.get(0).getAccessibility());
        return after1;
    }

    //西安北站
    public List<TrafficData> selectPoint2() {
        List<TrafficData> list2 = trafficMapper.selectPoint();
        List<TrafficData> after2 = new ArrayList<>();
        for (int l = 0; l < list2.size(); l++) {
            TrafficData a2 = new TrafficData();
            String point2 = list2.get(l).getBasePoint();
            Double dis2 = 0.00;
            String[] k2={"98d7b2968923dcf4a0222fb07c1cdf67",
                    "ab26aae06df35bc076a928d722de40f8",
                    "d764400433da3e6e2395c4406a293c9f"
            };
            // 返回一个0~(指定数-1)之间的随机值
            Random random2 = new Random();
            int ran2 = random2.nextInt(2);
            String key2 = k2[ran2];
            if (point2 == null) {
                dis2 = null;
                // System.out.println("point为空");
            } else {
                String startLonLat2 = "108.938602,34.37608";
                String endLonLat2 = point2;
                // System.out.println(startLonLat);
                //System.out.println(endLonLat);
                dis2 = getDistance(startLonLat2, endLonLat2, key2);
                //System.out.println(dis);
            }
            a2.setAccessibility(dis2);
            a2.setBaseName(list2.get(l).getBaseName());
            a2.setBasePoint(point2);
            a2.setBaseLongitude(list2.get(l).getBaseLongitude());
            a2.setBaseLatitude(list2.get(l).getBaseLatitude());
            //System.out.println(a.getBaseName()+a.getBasePoint()+a.getAccessibility());
            after2.add(l,a2);
             System.out.println("名称"+after2.get(l).getBaseName()+"可达性"+after2.get(l).getAccessibility());
        }
//        System.out.println("名称"+after.get(0).getBaseName()+"可达性"+after.get(0).getAccessibility());
        return after2;
    }
    //机场
    public List<TrafficData> selectPoint3() {
        List<TrafficData> list3 = trafficMapper.selectPoint();
        List<TrafficData> after3 = new ArrayList<>();
        for (int m = 0; m < list3.size(); m++) {
            TrafficData a3 = new TrafficData();
            String point3 = list3.get(m).getBasePoint();
            Double dis3 = 0.00;
            String[] k3={
                    "91ab4abc30069c37dc209791dd1ac224",
                    "d764400433da3e6e2395c4406a293c9f",
                    "1d54973156f6caa2a557dc5d6cdbea4c"
            };
            // 返回一个0~(指定数-1)之间的随机值
            Random random3 = new Random();
            int ran3 = random3.nextInt(3);
            String key3 = k3[ran3];
            if (point3 == null) {
                dis3 = null;
                // System.out.println("point为空");
            } else {
                String startLonLat3 = "108.764882,34.438179";
                String endLonLat3 = point3;
                // System.out.println(startLonLat);
                //System.out.println(endLonLat);
                dis3 = getDistance(startLonLat3, endLonLat3, key3);
                //System.out.println(dis);
            }
            a3.setAccessibility(dis3);
            a3.setBaseName(list3.get(m).getBaseName());
            a3.setBasePoint(point3);
            a3.setBaseLongitude(list3.get(m).getBaseLongitude());
            a3.setBaseLatitude(list3.get(m).getBaseLatitude());
            //System.out.println(a.getBaseName()+a.getBasePoint()+a.getAccessibility());
            after3.add(m,a3);
             System.out.println("名称"+after3.get(m).getBaseName()+"可达性"+after3.get(m).getAccessibility());
        }
//        System.out.println("名称"+after.get(0).getBaseName()+"可达性"+after.get(0).getAccessibility());
        return after3;
    }

    // KDE
    public String selectKDEPoint(){
        String picStr = null;
        List<TrafficData> list = trafficMapper.selectPoint();
        List<Double> lngList = new ArrayList<>();
        List<Double> latList = new ArrayList<>();
        for (int i = 0; i<list.size(); i++){
            Double a = list.get(i).getBaseLongitude();
            if (a != null){
                lngList.add(a);
            }


            Double b = list.get(i).getBaseLatitude();
            if (b != null){
                latList.add(b);
            }

        }
        System.out.println(lngList);
        picStr = getKDE(lngList,latList);
        return picStr;
    }
}
