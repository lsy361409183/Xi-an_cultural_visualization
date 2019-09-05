package com.xiaancultural1.demo.service;

import com.github.pagehelper.Page;
import com.xiaancultural1.demo.mapper.DomesticCulturalMapper;
import com.xiaancultural1.demo.pojo.DomesticData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DomesticCulturalService {
    @Autowired
    private DomesticCulturalMapper domesticCulturalMapper;

    //筛选全部信息
    public List<DomesticData> getDomesticData() {
        List<DomesticData> DomesticDatas = domesticCulturalMapper.getDomesticCulturalData();
        return DomesticDatas;
    }

}
