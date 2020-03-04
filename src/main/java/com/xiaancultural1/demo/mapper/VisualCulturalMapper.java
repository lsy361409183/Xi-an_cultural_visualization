package com.xiaancultural1.demo.mapper;

import com.xiaancultural1.demo.pojo.HistogramData;
import com.xiaancultural1.demo.pojo.MapData;
import com.xiaancultural1.demo.pojo.geoBase;
import com.xiaancultural1.demo.pojo.visualBase;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface VisualCulturalMapper {
    //加载地图
    List<MapData> selectJson(@Param("mapId")Integer mapId);
    //查询全部Geojson
     List<geoBase> selectAllGeojson();
    //区域和类别筛选Geojson
    List<geoBase> selectFileterGeojson(@Param("baseDistrict")String baseDistrict,
                                       @Param("baseClassification")String baseClassification);
    //区域筛选Geojson
    List<geoBase> selectRegionGeojson(@Param("baseDistrict")String baseDistrict);
    //类别筛选Geojson
    List<geoBase> selectTypeGeojson(@Param("baseClassification")String baseClassification);


    //查询出文地的基本信息：区域、类别、名称、位置、面积
    List<visualBase> selectAllInfo();
    //区域和类别筛选
    List<visualBase> selectInfo(@Param("baseDistrict")String baseDistrict,
                                @Param("baseClassification")String baseClassification);
    //区域筛选
    List<visualBase> selectInfoByRegion(@Param("baseDistrict")String baseDistrict);
    //类别筛选
    List<visualBase> selectInfoByType(@Param("baseClassification")String baseClassification);

    //按片区模糊查询geo
    List<geoBase> selectGeoByRegion(@Param("baseGeo") String baseGeo);
    //按片区模糊查询文地点
    List<visualBase> selecPointByRegion(@Param("baseGeo") String baseGeo);

    //按名称模糊查询Geojson
    List<geoBase> selectGeoBySearchText(@Param("baseName") String baseName,
                                        @Param("baseDistrict") String baseDistrict);

    // 按名称模糊查询文地点
    List<visualBase> selectInfoBySearchText(@Param("baseName") String baseName,
                                            @Param("baseDistrict") String baseDistrict);
    //堆叠柱状图
    List<HistogramData> selectHistogramData();

    //条件筛选堆叠柱状图
    List<HistogramData> selectAreaData(@Param("baseDistrict")String baseDistrict,
                                       @Param("baseClassification")String baseClassification);

}
