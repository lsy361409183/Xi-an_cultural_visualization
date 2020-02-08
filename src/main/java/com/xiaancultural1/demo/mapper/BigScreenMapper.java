package com.xiaancultural1.demo.mapper;

import com.xiaancultural1.demo.pojo.BigScreenBase;
import com.xiaancultural1.demo.pojo.visualBase;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
@Mapper
public interface BigScreenMapper {
    //查询各区域的面积
    List<BigScreenBase> selectArea(@Param("cityCode")String cityCode);
    //查询不同区域的面积 传参数
    List<BigScreenBase> selectallArea(@Param("cityCode")String cityCode);
    //排名前十的文地
    List<visualBase> selectRanking(@Param("cityCode")String cityCode);
    //西安排名前十的文地
    List<visualBase> selectXianRanking(@Param("cityCode")String cityCode);
}
