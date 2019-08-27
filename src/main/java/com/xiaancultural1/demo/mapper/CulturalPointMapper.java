package com.xiaancultural1.demo.mapper;

import com.xiaancultural1.demo.pojo.CulturalPoint;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CulturalPointMapper {
    //查全部
    public List<CulturalPoint> selectAll();
    //根据地区查全部信息
    public List<CulturalPoint> selectAllByRegion(@Param("district")String district);
}
