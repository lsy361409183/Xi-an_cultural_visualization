package com.xiaancultural1.demo.mapper;

import com.xiaancultural1.demo.pojo.CultureLand;
import com.xiaancultural1.demo.pojo.ResArea;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface ResCulMapper {
    List<CultureLand> selectAllCul();

    List<ResArea> selectAllRes();
}
