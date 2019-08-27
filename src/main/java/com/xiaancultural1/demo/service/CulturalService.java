package com.xiaancultural1.demo.service;

import com.xiaancultural1.demo.mapper.CulturalPointMapper;
import com.xiaancultural1.demo.pojo.CulturalPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CulturalService {
    @Autowired
    private CulturalPointMapper culturalPointMapper;


    public List<CulturalPoint> selectAll(){
        return culturalPointMapper.selectAll();
    }
    public List<CulturalPoint> selectAllByRegion(String district){
        return culturalPointMapper.selectAllByRegion(district);
    }
}
