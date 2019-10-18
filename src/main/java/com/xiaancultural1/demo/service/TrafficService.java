package com.xiaancultural1.demo.service;

import com.xiaancultural1.demo.mapper.TrafficMapper;
import com.xiaancultural1.demo.pojo.TrafficData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static com.xiaancultural1.demo.controller.GetDistance.getDistance;

@Service
public class TrafficService {
    @Autowired
    private TrafficMapper trafficMapper;
    //查询出所有的文地的经纬度点
    public List<TrafficData> selectPoint() {
        List<TrafficData> list = trafficMapper.selectPoint();
        List<TrafficData> after = new ArrayList<>();

            for (int i = 0; i < list.size(); i++) {
                TrafficData a = new TrafficData();
                String point = list.get(i).getBasePoint();
                Double dis = 0.00;
                    if (point == null) {
                        dis = null;
                       // System.out.println("point为空");
                    } else {
                        String[] k={"b1c8c31729c23c2712acb0017eb915f6",
                        "10ac57c56404c6713bc970dc8b1192ca",
                        "57f8d8f793af2a1c5969aa4ea0160682",
                        "a6cf1b9378362a5e98a01dbd0dea44ab",
                        "595119ffba7b522251c3b003fd8a9670",
                        "1d54973156f6caa2a557dc5d6cdbea4c",
                        "98d7b2968923dcf4a0222fb07c1cdf67",
                        "ab26aae06df35bc076a928d722de40f8",
                        "c81d5b57fe288af2c84e71a76ddd9340",
                        "91ab4abc30069c37dc209791dd1ac224"};
                        // 返回一个0~(指定数-1)之间的随机值
                        Random random = new Random();
                        int ran = random.nextInt(7);
                        String key = k[ran];
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
                      System.out.println(i+"名称"+after.get(i).getBaseName()+"可达性"+after.get(i).getAccessibility());
                }
//        System.out.println("名称"+after.get(0).getBaseName()+"可达性"+after.get(0).getAccessibility());
        return after;
    }
}
