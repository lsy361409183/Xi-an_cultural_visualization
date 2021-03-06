package com.xiaancultural1.demo.mapper;


import com.xiaancultural1.demo.pojo.tableBase;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;


import java.util.List;

@Mapper
@Repository
public interface TableCulturalMapper {
//
//
    List<tableBase> selectAllTable(@Param("baseDistrict") String baseDistrict,
                                   @Param("baseClassification") String baseClassification);

    List<tableBase> selectTableWithRegionAndClassification(@Param("baseDistrict") String baseDistrict,
                                                           @Param("baseClassification") String baseClassification);
    //区域筛选
    List<tableBase> selectTableByRegion(@Param("baseDistrict")String baseDistrict);
    //类别筛选
    List<tableBase> selectTableByClassification(@Param("baseClassification")String baseClassification);

    //四个模糊查询接口
    List<tableBase> selectTableFuzzySearch(@Param("fuzzyName") String fuzzyName,@Param("baseDistrict") String baseDistrict,
                                           @Param("baseClassification") String baseClassification);
    List<tableBase> selectTableFuzzySearchAll(@Param("fuzzyName")String fuzzyName,@Param("baseDistrict") String baseDistrict,
                                              @Param("baseClassification") String baseClassification);

    List<tableBase> selectTableFuzzySearchRegion(@Param("fuzzyName")String fuzzyName,@Param("baseDistrict") String baseDistrict,
                                                 @Param("baseClassification") String baseClassification);

    List<tableBase> selectTableFuzzySearchClassification(@Param("fuzzyName")String fuzzyName,@Param("baseDistrict") String baseDistrict,
                                                 @Param("baseClassification") String baseClassification);

    //查图片及地图高亮的接口
    List<tableBase> selectTableByIdClick(@Param("baseId")Integer baseId);


}
