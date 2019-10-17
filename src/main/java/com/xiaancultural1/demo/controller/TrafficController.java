package com.xiaancultural1.demo.controller;

import com.xiaancultural1.demo.pojo.TrafficData;
import com.xiaancultural1.demo.service.TrafficService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
public class TrafficController {
    @Autowired
    private TrafficService trafficService;

    //查询出所有的文地的经纬度点
    @RequestMapping("/getTrafficData")
    @ResponseBody
    public List<TrafficData> selectPoint() {
        List<TrafficData> list = trafficService.selectPoint();
            return list;
}
}
