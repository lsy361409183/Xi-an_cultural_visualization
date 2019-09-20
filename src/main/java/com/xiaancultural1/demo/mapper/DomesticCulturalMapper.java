package com.xiaancultural1.demo.mapper;

import com.xiaancultural1.demo.pojo.DomesticData;
import com.xiaancultural1.demo.pojo.MapData;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


@Mapper
public interface DomesticCulturalMapper {
//国内外文地数据
    List<DomesticData> getDomesticCulturalData();
    //加载地图
    List<MapData> selectJson(@Param("mapId")Integer mapId);

}

