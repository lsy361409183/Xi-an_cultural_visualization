package com.xiaancultural1.demo.controller;

import com.github.pagehelper.Page;
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
    public PageInfo<tableBase> lists(@RequestParam(value = "page") int page,
                                     @RequestParam(value = "baseDistrict",defaultValue = "全部",required = false)String baseDistrict,
                                     @RequestParam(value = "baseClassification",defaultValue = "全部",required = false)String baseClassification,
                                     @RequestParam(value = "fuzzyName",required = false)String fuzzyName){
//        设置分页规则
       // PageHelper.clearPage();
        PageHelper.startPage(page,40);
//        返回所有分页信息参数为查询所有记录的信息
        PageInfo<tableBase> pageInfo = new PageInfo<>(tableCulturalService.selectAllTableWithPage(baseDistrict,baseClassification));
        return pageInfo;

    }
    //分页按条件筛选
    @RequestMapping("/region")
    @ResponseBody
    public PageInfo<tableBase> RegionLists(@RequestParam(value = "page")int page,
                                           @RequestParam(value = "baseDistrict",required = false)String baseDistrict,
                                            @RequestParam(value = "baseClassification",required = false)String baseClassification,
                                           @RequestParam(value = "fuzzyName",required = false)String fuzzyName) {
        PageHelper.clearPage();
        PageHelper.startPage(page, 40);
        System.out.println(fuzzyName);
        if (fuzzyName != "''") {
            if(baseDistrict.equals("'全部'")&&baseClassification.equals("'全部'")) {
                return new PageInfo<>(tableCulturalService.selectAllTableWithPageAll(fuzzyName,baseDistrict,baseClassification));
            } else if(baseClassification.equals("'全部'")){
                return new PageInfo<>(tableCulturalService.selectTableWithRegionFuzzy(fuzzyName,baseDistrict,baseClassification));
            } else if(baseDistrict.equals("'全部'")){
                return new PageInfo<>(tableCulturalService.selectTableWithClassificationFuzzy(fuzzyName,baseDistrict,baseClassification));
            }else {
                return new PageInfo<>(tableCulturalService.selectTableFuzzySearch(fuzzyName, baseDistrict, baseClassification));
            }
        } else {
            if (baseDistrict.equals("'全部'") && baseClassification.equals("'全部'")) {
                return new PageInfo<>(tableCulturalService.selectAllTableWithPage(baseDistrict, baseClassification));
            } else if (baseDistrict.equals("'全部'")) {
                return new PageInfo<>(tableCulturalService.selectTableByClassification(baseClassification));
            } else if (baseClassification.equals("'全部'")) {
                return new PageInfo<>(tableCulturalService.selectTableByRegion(baseDistrict));
            } else {
                return new PageInfo<>(tableCulturalService.selectTableWithRegionAndClassificationWithPage(baseDistrict, baseClassification));
            }
        }
    }
    @RequestMapping("/fuzzy")
    @ResponseBody
    public PageInfo<tableBase> fuzzyLists(@RequestParam(value = "page")int page,@RequestParam(value = "baseDistrict",required = false)String baseDistrict,
                                          @RequestParam(value = "baseClassification",required = false)String baseClassification,
                                          @RequestParam(value = "fuzzyname")String fuzzyName){
        PageHelper.clearPage();
        PageHelper.startPage(page,40);
        PageInfo<tableBase> pageInfo=new PageInfo<>(tableCulturalService.selectTableFuzzySearch(baseDistrict,baseClassification,fuzzyName));
        return pageInfo;
    }

    @RequestMapping("/click")
    @ResponseBody
    public List<tableBase> clickLists(@RequestParam(value = "baseId",required = false)Integer baseId){
        System.out.println(tableCulturalService.selectIdClick(baseId).get(0).getBaseLatandlon());
        List<tableBase> u1= tableCulturalService.selectIdClick(baseId);
        u1.get(0).setBaseLatandlon('['+tableCulturalService.selectIdClick(baseId).get(0).getBaseLatandlon()+']');
        System.out.println(u1.get(0).getBaseLatandlon());
        return u1;
    }


}
