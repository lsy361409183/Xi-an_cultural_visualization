package com.xiaancultural1.demo.controller;

import com.xiaancultural1.demo.pojo.CulturalPoint;
import com.xiaancultural1.demo.service.CulturalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CulturalPointController {

    @Autowired
    private CulturalService culturalService;

    @RequestMapping("/selectAll")
    @ResponseBody
    public List<CulturalPoint> selectAll(){
        return culturalService.selectAll();
    }

    @RequestMapping("/selectAllByRegion")
    public List<CulturalPoint> selectAllByRegion(@RequestParam("district")String district){
        System.out.println(district);
        return culturalService.selectAllByRegion(district);
    }
}
