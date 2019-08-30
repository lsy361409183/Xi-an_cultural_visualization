package com.xiaancultural1.demo.mapper;

import com.xiaancultural1.demo.pojo.visualBase;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface VisualCulturalMapper {
    //查询出文地的基本信息：区域、类别、名称、位置、面积
    List<visualBase> selectAllInfo();
}
