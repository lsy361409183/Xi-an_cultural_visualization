package com.xiaancultural1.demo.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.xiaancultural1.demo.pojo.tableBase;
import com.xiaancultural1.demo.service.TableCulturalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TableCulturalController {
    @Autowired
    private TableCulturalService tableCulturalService;


    @GetMapping("/{page}")
    public PageInfo<tableBase> lists(@PathVariable int page){
//        设置分页规则
        PageHelper.startPage(page,20);
//        返回所有分页信息参数为查询所有记录的信息
        PageInfo<tableBase> pageInfo = new PageInfo<>(tableCulturalService.selectAllTableWithPage());
        return pageInfo;
    }

    @GetMapping("/select")
    public List<tableBase> paraList(@RequestParam(defaultValue = "1") int p,
                                    @RequestParam(defaultValue = "20") int size){
//        设置分页规则
        PageHelper.startPage(p,size);
//        取数据，插件会自动按照规则分页显示数据
        return tableCulturalService.selectAllTable();
    }
}
