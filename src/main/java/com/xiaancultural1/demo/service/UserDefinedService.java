package com.xiaancultural1.demo.service;

import com.xiaancultural1.demo.mapper.VisualCulturalMapper;

import com.xiaancultural1.demo.pojo.visualBase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserDefinedService {
    @Autowired
    private VisualCulturalMapper visualCulturalMapper02;

    //查询出文地的基本信息：区域、类别、名称、位置、面积
    public List<visualBase> selectAllInfo(){
        return visualCulturalMapper02.selectAllInfo();
    }

}
