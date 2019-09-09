package com.xiaancultural1.demo.mapper;


import com.xiaancultural1.demo.pojo.tableBase;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;


import java.util.List;

@Mapper
//@Repository
public interface TableCulturalMapper {
//
//
    List<tableBase> selectAllTable(@Param("baseDistrict") String baseDistrict,
                                   @Param("baseClassification") String baseClassification);

    List<tableBase> selectTableWithRegionAndClassification(@Param("baseDistrict") String baseDistrict,
                                                           @Param("baseClassification") String baseClassification);


}
