package com.xiaancultural1.demo.mapper;

import com.xiaancultural1.demo.pojo.TrafficData;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TrafficMapper {
    //查询出所有的文地的经纬度点
    List<TrafficData> selectPoint();
}
