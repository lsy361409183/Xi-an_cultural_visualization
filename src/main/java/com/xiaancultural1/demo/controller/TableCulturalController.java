package com.xiaancultural1.demo.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.xiaancultural1.demo.pojo.tableBase;
import com.xiaancultural1.demo.service.TableCulturalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TableCulturalController {
    @Autowired
    private TableCulturalService tableCulturalService;

    //根据页码分页，写死20条，全部记录
    @RequestMapping("/select")
    @ResponseBody
    public PageInfo<tableBase> lists(@RequestParam(value = "page") int page){
//        设置分页规则
       // PageHelper.clearPage();
        PageHelper.startPage(page,20);
//        返回所有分页信息参数为查询所有记录的信息
        PageInfo<tableBase> pageInfo = new PageInfo<>(tableCulturalService.selectAllTableWithPage());
        return pageInfo;

    }
    //分页按条件筛选
    @RequestMapping("/region")
    @ResponseBody
    public PageInfo<tableBase> RegionLists(@RequestParam(value = "page")int page,
                                           @RequestParam(value = "baseDistrict")String baseDistrict,
                                            @RequestParam(value = "baseClassification")String baseClassification){
        PageHelper.clearPage();
        PageHelper.startPage(page,20);
        PageInfo<tableBase> pageInfo=new PageInfo<>(tableCulturalService.selectTableWithRegionAndClassificationWithPage(baseDistrict,baseClassification));
        return pageInfo;
    }


}
