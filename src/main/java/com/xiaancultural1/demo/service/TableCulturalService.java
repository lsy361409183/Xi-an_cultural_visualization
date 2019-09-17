package com.xiaancultural1.demo.service;

import com.github.pagehelper.Page;
import com.xiaancultural1.demo.mapper.TableCulturalMapper;
import com.xiaancultural1.demo.pojo.tableBase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TableCulturalService {
    @Autowired
    private TableCulturalMapper tableCulturalMapper;

    public Page<tableBase> selectAllTableWithPage(String baseDistrict,String baseClassification) {
        return (Page<tableBase>) tableCulturalMapper.selectAllTable(baseDistrict,baseClassification);
    }

    public Page<tableBase> selectTableWithRegionAndClassificationWithPage(String baseDistrict,String baseClassification){
        return (Page<tableBase>) tableCulturalMapper.selectTableWithRegionAndClassification(baseDistrict,baseClassification);
    }

    public Page<tableBase> selectTableByRegion(String baseDistrict){
        return (Page<tableBase>) tableCulturalMapper.selectTableByRegion(baseDistrict);
    }

    public Page<tableBase> selectTableByClassification(String baseClassification){
        return (Page<tableBase>) tableCulturalMapper.selectTableByClassification(baseClassification);
    }
    public Page<tableBase> selectTableFuzzySearch(String baseDistrict,String baseClassification,String fuzzyName){
        System.out.println(baseDistrict+"service1");
        System.out.println(baseClassification);
        System.out.println(fuzzyName);
//        System.out.println(tableCulturalMapper.selectTableFuzzySearch(baseDistrict,baseClassification,fuzzyName));
        return (Page<tableBase>) tableCulturalMapper.selectTableFuzzySearch(baseDistrict,baseClassification,fuzzyName);
    }




}
