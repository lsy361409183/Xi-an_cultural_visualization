package com.xiaancultural1.demo.controller;

import com.xiaancultural1.demo.pojo.TrafficData;
import com.xiaancultural1.demo.service.TrafficService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@RestController
public class TrafficController {
    @Autowired
    private TrafficService trafficService;
    //计算出可达性比较高的5大文地
    public void findFifth(List<TrafficData> list,String s)
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
            System.out.println(s+"名称"+res.getBaseName()+","+"可达性"+res.getAccessibility());
        }
    }

    //查询出所有的文地的经纬度点
    //钟楼商圈
    @RequestMapping("/getTrafficData")
    @ResponseBody
    public List<TrafficData> selectPoint() {
        List<TrafficData> list = trafficService.selectPoint();
            return list;
    }
    //小寨商圈
    @RequestMapping("/getTrafficData1")
    @ResponseBody
    public List<TrafficData> selectPoint1() {
        List<TrafficData> list1 = trafficService.selectPoint1();
//        String s ="小寨";
//        findFifth(list1,s);
        return list1;
    }
    //大雁塔商圈
    @RequestMapping("/getTrafficData2")
    @ResponseBody
    public List<TrafficData> selectPoint2() {
        List<TrafficData> list2 = trafficService.selectPoint2();
//        String s ="大雁塔";
//        findFifth(list2,s);
        return list2;
    }
    //龙首原商圈
    @RequestMapping("/getTrafficData3")
    @ResponseBody
    public List<TrafficData> selectPoint3() {
        List<TrafficData> list3 = trafficService.selectPoint3();
//        String s ="龙首原";
//        findFifth(list3,s);
        return list3;
    }

    // KDE
    @RequestMapping("/getKDEPoint")
    @ResponseBody
    public String  selectKDE() {
        String picStr = trafficService.selectKDEPoint();

        return picStr;
    }

    // KDE
    @RequestMapping("/getWGSPoint")
    @ResponseBody
    public List<String> selectWGS() {
        List<String> a =trafficService.transform();
        for (String b:a){
            System.out.println(b);
        }
        return a;
    }
}
