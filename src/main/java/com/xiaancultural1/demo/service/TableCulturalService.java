package com.xiaancultural1.demo.service;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
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

        return (Page<tableBase>) tableCulturalMapper.selectTableFuzzySearch(baseDistrict,baseClassification,fuzzyName);
    }

    public Page<tableBase> selectAllTableWithPageAll(String baseDistrict,String baseClassification,String fuzzyName) {
        return (Page<tableBase>) tableCulturalMapper.selectTableFuzzySearchAll(baseDistrict,baseClassification,fuzzyName);
    }

    public Page<tableBase> selectTableWithRegionFuzzy(String baseDistrict,String baseClassification,String fuzzyName) {
        return (Page<tableBase>) tableCulturalMapper.selectTableFuzzySearchRegion(baseDistrict,baseClassification,fuzzyName);
    }

    public Page<tableBase> selectTableWithClassificationFuzzy(String baseDistrict,String baseClassification,String fuzzyName) {
        return (Page<tableBase>) tableCulturalMapper.selectTableFuzzySearchClassification(baseDistrict,baseClassification,fuzzyName);
    }


    public  List<tableBase> selectIdClick(Integer baseId){
        return  tableCulturalMapper.selectTableByIdClick(baseId);
    }


}
