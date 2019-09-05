package com.xiaancultural1.demo.mapper;


import com.xiaancultural1.demo.pojo.tableBase;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;


import java.util.List;

@Mapper
//@Repository
public interface TableCulturalMapper {
//    @Select("select * from  public.\"tb_base_data\"")
//    @Results({
//            @Result(column="base_district",property="baseDistrict"),
//            @Result(column="base_district_id",property="baseDistrictId"),
//            @Result(column="base_id",property="baseId"),
//            @Result(column="base_name",property="baseName"),
//            @Result(column="base_region",property="baseRegion"),
//            @Result(column="base_area",property="baseArea"),
//            @Result(column="base_date",property="baseDate"),
//            @Result(column="base_planeform",property="basePlaneform"),
//            @Result(column="base_classification",property="baseClassification"),
//            @Result(column="base_basis",property="baseBasis"),
//            @Result(column="base_unit",property="baseUnit"),
//            @Result(column="base_remarks",property="baseRemarks")}
//    )
    List<tableBase> selectAllTable();


//    //按照区域筛选所有属性
//    @Select("Select * from public.\"tb_base_data\" where base_district in(select base_district from  public.\"tb_base_data\")")
//    @Results(
//            {@Result(property = "baseDistrict",column = "base_district"),
//                    @Result(property = "baseDistrictId",column = "base_district_id"),
//                    @Result(property = "baseId",column = "base_id"),
//                    @Result(property = "baseName",column = "base_name"),
//                    @Result(property = "baseRegion",column = "base_region"),
//                    @Result(property = "baseArea",column = "base_area"),
//                    @Result(property = "baseDate",column = "base_date"),
//                    @Result(property = "basePlaneform",column = "base_planeform"),
//                    @Result(property = "baseClassification",column = "base_classification"),
//                    @Result(property = "baseBasis",column = "base_basis"),
//                    @Result(property = "baseUnit",column = "base_unit"),
//                    @Result(property = "baseRemarks",column = "base_remarks")}
//    )
//    List<tableBase> selectAllTableByDistrict();
//
//    //按照区域筛选所有属性
//    @Select("Select * from public.\"tb_base_data\" where base_classification in(select base_classification from  public.\"tb_base_data\")")
//    @Results(
//            {@Result(property = "baseDistrict",column = "base_district"),
//                    @Result(property = "baseDistrictId",column = "base_district_id"),
//                    @Result(property = "baseId",column = "base_id"),
//                    @Result(property = "baseName",column = "base_name"),
//                    @Result(property = "baseRegion",column = "base_region"),
//                    @Result(property = "baseArea",column = "base_area"),
//                    @Result(property = "baseDate",column = "base_date"),
//                    @Result(property = "basePlaneform",column = "base_planeform"),
//                    @Result(property = "baseClassification",column = "base_classification"),
//                    @Result(property = "baseBasis",column = "base_basis"),
//                    @Result(property = "baseUnit",column = "base_unit"),
//                    @Result(property = "baseRemarks",column = "base_remarks")}
//    )
//    List<tableBase> selectAllTableByDClassification();

}
