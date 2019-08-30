package com.xiaancultural1.demo.controller;

import com.xiaancultural1.demo.pojo.visualBase;
import com.xiaancultural1.demo.service.VisualCulturalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class VisualCulturalController {
    @Autowired
    private VisualCulturalService visualCulturalService;
    //查询出文地的基本信息：区域、类别、名称、位置、面积
    @RequestMapping("/getVisualData")
    @ResponseBody
    public List<visualBase> selectAllInfo(){
        return visualCulturalService.selectAllInfo();
    }

}
