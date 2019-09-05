package com.xiaancultural1.demo.mapper;

import com.xiaancultural1.demo.pojo.DomesticData;
//import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


public interface DomesticCulturalMapper {
//国内外文地数据
    List<DomesticData> getDomesticCulturalData();
}
