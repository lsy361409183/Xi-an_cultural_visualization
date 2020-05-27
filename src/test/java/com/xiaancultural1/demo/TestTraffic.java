package com.xiaancultural1.demo;

import com.xiaancultural1.demo.pojo.TrafficData;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class TestTraffic {
    public static void main(String[] args) {
        List<TrafficData> list = new ArrayList<>();
        TrafficData t = new TrafficData();
        TrafficData t1 = new TrafficData();
        TrafficData t3 = new TrafficData();
        t.setBaseName("钟楼");
        t1.setBaseLatitude(108.11);
        t1.setBaseLatitude(111.11);
        t1.setBaseName("明城墙");
        t3.setBaseName("大雁塔");

        t1.setAccessibility(11.11);
        t3.setAccessibility(44.44);
        list.add(t);
        list.add(t1);
        list.add(t3);
        findFifth(list);
    }
    public static void findFifth(List<TrafficData> list)
    {
        Collections.sort(list, new Comparator<TrafficData>() {
            @Override
            public int compare(TrafficData o1, TrafficData o2) {
                boolean b1 = o1.getAccessibility()==null||o1==null;
                boolean b2 = o2.getAccessibility()==null||o2==null;
                boolean b = b1&&b2;
                if(b){
                    return 0;
                }
                if(b1){
                    return -1;
                }
                if(b2){
                    return 1;
                }
                Double d1 = o1.getAccessibility();
                Double d2 = o2.getAccessibility();
                if(d1>d2)
                    return 1;
                if (d1<d2)
                    return -1;
                else
                    return 0;
            }
        });
        for(TrafficData res:list){
            System.out.println("钟楼商圈"+"名称"+res.getBaseName()+","+"可达性"+res.getAccessibility());
        }
    }
}
