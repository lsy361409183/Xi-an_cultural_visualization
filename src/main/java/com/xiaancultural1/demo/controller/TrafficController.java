package com.xiaancultural1.demo.controller;

import com.xiaancultural1.demo.pojo.TrafficData;
import com.xiaancultural1.demo.service.TrafficService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class TrafficController {
    @Autowired
    private TrafficService trafficService;

    //查询出所有的文地的经纬度点
    //西安站
    @RequestMapping("/getTrafficData")
    @ResponseBody
    public List<TrafficData> selectPoint() {
        List<TrafficData> list = trafficService.selectPoint();
            return list;
    }
    //西安南站
    @RequestMapping("/getTrafficData1")
    @ResponseBody
    public List<TrafficData> selectPoint1() {
        List<TrafficData> list1 = trafficService.selectPoint1();
        return list1;
    }
    //西安北站
    @RequestMapping("/getTrafficData2")
    @ResponseBody
    public List<TrafficData> selectPoint2() {
        List<TrafficData> list2 = trafficService.selectPoint2();
        return list2;
    }
    //机场
    @RequestMapping("/getTrafficData3")
    @ResponseBody
    public List<TrafficData> selectPoint3() {
        List<TrafficData> list3 = trafficService.selectPoint3();
        return list3;
    }

    // KDE
    @RequestMapping("/getKDEPoint")
    @ResponseBody
    public String  selectKDE() {
        String picStr = trafficService.selectKDEPoint();

        return picStr;
    }
}
