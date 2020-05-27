package com.xiaancultural1.demo.mapper;

import org.apache.ibatis.annotations.*;

@Mapper
public interface Base64Mapper {
    //数据库里插入base64码
    @Update("UPDATE tb_base_data SET base_picture = '${basePicture}' WHERE base_name = '${baseName}';")
   public void insertBase64(String basePicture,String baseName);
}
