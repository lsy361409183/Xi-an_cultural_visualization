package com.xiaancultural1.demo.service;

import com.github.pagehelper.Page;
import com.xiaancultural1.demo.mapper.TableCulturalMapper;
import com.xiaancultural1.demo.pojo.tableBase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TableCulturalService {
    @Autowired
    private TableCulturalMapper tableCulturalMapper;

    //筛选全部信息
    public List<tableBase> selectAllTable() {
        return tableCulturalMapper.selectAllTable();
    }

    public Page<tableBase> selectAllTableWithPage() {
        return (Page<tableBase>) tableCulturalMapper.selectAllTable();
    }

}
