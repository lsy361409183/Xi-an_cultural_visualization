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
    @GetMapping("/select")
    @ResponseBody
    public PageInfo<tableBase> lists(@RequestParam(value = "page") int page){
//        设置分页规则
       // PageHelper.clearPage();
        PageHelper.startPage(page,20);
//        返回所有分页信息参数为查询所有记录的信息
        PageInfo<tableBase> pageInfo = new PageInfo<>(tableCulturalService.selectAllTableWithPage());
        return pageInfo;

//        return tableCulturalService.selectAllTableWithPage();
    }

//    @GetMapping("/select1")
//    public PageInfo<tableBase> districtLists(@RequestParam String district,@RequestParam int page){
//        PageHelper.startPage(page,20);
//        PageInfo<tableBase> pageInfo =new PageInfo<>(tableCulturalService.selectAllTableByDistrictWithPage());
//        return pageInfo;
//    }
//    @GetMapping("/select2")
//    public PageInfo<tableBase> classificationLists(@RequestParam String classification,@RequestParam int page){
//        PageHelper.startPage(page,20);
//        PageInfo<tableBase> pageInfo =new PageInfo<>(tableCulturalService.selectAllTableByClassificationtWithPage());
//        return pageInfo;
//    }
//    //传页码以及每页条数，全部记录
//    @GetMapping("/select1")
//    public List<tableBase> paraList(@RequestParam(defaultValue = "1") int p,
//                                    @RequestParam(defaultValue = "20") int size){
////        设置分页规则
//        PageHelper.startPage(p,size);
////        取数据，插件会自动按照规则分页显示数据
//        return tableCulturalService.selectAllTable();
//    }

}
