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
                o.put("data", a);
            }
            return o;
        }


    //查询不同区域的面积 不传参数
    @RequestMapping("/getAllArea")
    @ResponseBody
    HashMap<String, Object> selectallArea(@Param("cityCode")String cityCode){
        System.out.println(cityCode);
        if(cityCode!=null||cityCode=="") {
            List<BigScreenBase> list1 = bigScreenService.selectallArea(cityCode);
            List<Area> list2 = new ArrayList<>();
            HashMap<String, Object> o = new HashMap<>();

            for (int m = 0; m < list1.size(); m++) {

                Area a = new Area();
                a.setName(list1.get(m).getBaseDistrict());
                a.setValue(list1.get(m).getVisualArea());
                list2.add(m, a);
            }
            for (int i = 0; i < list2.size(); i++) {
                System.out.println(list2.get(i).getName());
                System.out.println(list1.get(i).getBaseDistrict());
            }
            o.put("data", list2);
            return o;
        }
        else
            return null;
    }
}
