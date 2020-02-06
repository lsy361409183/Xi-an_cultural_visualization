package com.xiaancultural1.demo.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.xiaancultural1.demo.pojo.BigScreenBase;
import com.xiaancultural1.demo.service.BigScreenService;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Controller
public class BigScreenController {
    @Autowired
    private BigScreenService bigScreenService;
    public class Area{
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Integer getValue() {
            return value;
        }

        public void setValue(Integer value) {
            this.value = value;
        }

        private String name;
        private Integer value;
    }
    //查询各区域的面积
    @RequestMapping("/getCodeArea")
    @ResponseBody
    HashMap<String, Object> selectArea(@Param("cityCode")String cityCode) {
        List<BigScreenBase> list1 = bigScreenService.selectArea(cityCode);
        HashMap<String, Object> o = new HashMap<>();
       Area a = new Area();
        for (int m = 0; m < list1.size(); m++) {
            BigScreenBase b = new BigScreenBase();
            String district = list1.get(m).getBaseDistrict();
            Integer area = list1.get(m).getVisualArea();
            b.setBaseDistrict(district);
            b.setVisualArea(area);
            a.setName(b.getBaseDistrict());
            a.setValue(b.getVisualArea());
            o.put("data",a);
        }
        return o;
    }
}
