package com.xiaancultural1.demo.service;

import com.xiaancultural1.demo.mapper.VisualCulturalMapper;
import com.xiaancultural1.demo.pojo.MapData;
import com.xiaancultural1.demo.pojo.visualBase;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisualCulturalService {
    @Autowired
    private VisualCulturalMapper visualCulturalMapper;

    //加载地图
    public List<MapData> selectJson(Integer mapId){
        return visualCulturalMapper.selectJson(mapId);
    };
    //查询出文地的基本信息：区域、类别、名称、位置、面积
    public List<visualBase> selectAllInfo(){
        return visualCulturalMapper.selectAllInfo();
    }
    //区域和类别筛选
    public List<visualBase> selectInfo(String baseDistrict,String baseClassification){
        return visualCulturalMapper.selectInfo(baseDistrict,baseClassification);
    }
    //区域筛选
    public List<visualBase> selectInfoByRegion(String baseDistrict){
        return visualCulturalMapper.selectInfoByRegion(baseDistrict);
    }
    //类别筛选
    public List<visualBase> selectInfoByType(String baseClassification){
        return visualCulturalMapper.selectInfoByType(baseClassification);
    }
}
