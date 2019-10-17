package com.xiaancultural1.demo.service;

import com.xiaancultural1.demo.mapper.TrafficMapper;
import com.xiaancultural1.demo.pojo.TrafficData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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
                        String key = "c81d5b57fe288af2c84e71a76ddd9340";
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
