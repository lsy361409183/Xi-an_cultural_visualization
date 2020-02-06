package com.xiaancultural1.demo.mapper;

import com.xiaancultural1.demo.pojo.BigScreenBase;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
@Mapper
public interface BigScreenMapper {
    //查询各区域的面积
    List<BigScreenBase> selectArea(@Param("cityCode")String cityCode);
}
