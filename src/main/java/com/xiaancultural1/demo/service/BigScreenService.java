package com.xiaancultural1.demo.service;

import com.xiaancultural1.demo.mapper.BigScreenMapper;
import com.xiaancultural1.demo.pojo.BigScreenBase;
import com.xiaancultural1.demo.pojo.visualBase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
@Service
public class BigScreenService {
    @Autowired
            private  BigScreenMapper bigScreenMapper;
    //查询各区域的面积
    public List<BigScreenBase> selectArea(String cityCode){
        return bigScreenMapper.selectArea(cityCode);
}
    //查询不同区域的面积 不传参数
    public List<BigScreenBase> selectallArea(String cityCode){
        return bigScreenMapper.selectallArea(cityCode);
    }
    //查询排名前十的
    public List<visualBase> selectRanking(String cityCode){
        return bigScreenMapper.selectRanking(cityCode);
    }
    //西安排名前十的文地
    public List<visualBase> selectXianRanking(String cityCode){
        return bigScreenMapper.selectXianRanking(cityCode);
    }
}
