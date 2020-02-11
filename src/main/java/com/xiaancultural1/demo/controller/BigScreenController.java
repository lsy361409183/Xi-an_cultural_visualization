package com.xiaancultural1.demo.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.xiaancultural1.demo.pojo.BigScreenBase;
import com.xiaancultural1.demo.pojo.visualBase;
import com.xiaancultural1.demo.service.BigScreenService;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.lang.reflect.Array;
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
            List<Area> k=new ArrayList();
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
                k.add(0,a);
                o.put("data", k);
            }
            return o;
        }


    //查询不同区域的面积
    @RequestMapping("/getAllArea")
    @ResponseBody
    HashMap<String, Object> selectallArea(@Param("cityCode")String cityCode){
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
            o.put("data", list2);
            return o;
        }
        else
            return null;
    }
    //查询排名前十的文地
    @RequestMapping("/getRanking")
    @ResponseBody
    HashMap<String, Object> selectRanking(@Param("cityCode")String cityCode){
        HashMap<String, Object> o = new HashMap<>();
        System.out.println(cityCode);
        List<visualBase> data = new ArrayList<>();
        if (cityCode.equals(610100)||cityCode.equals("610100")){
            System.out.println("西安");
          data =bigScreenService.selectXianRanking(cityCode);
        }else {
            data = bigScreenService.selectRanking(cityCode);
        }
        String[] name = new String[10];
        Double[] area = new Double[10];
        for (int m = 0; m < data.size(); m++) {
            String a = data.get(m).getBaseName();
            Double b = data.get(m).getBaseArea();
            while (name[m] == null || area[m] == null) {
                name[m] = a;
                area[m] = b;
            }
            o.put("data0", name);
            o.put("data1", area);
        }
        return o;
    }
    //查询不同区域的类别面积
    @RequestMapping("/getTypeArea")
    @ResponseBody
    Object[] selectTypeArea(@Param("cityCode")String cityCode){
        HashMap<String, Object> o = new HashMap<>();
        HashMap<String, Object> o2 = new HashMap<>();
        List<Area> list2 = new ArrayList<>();
        Object[] h =new Array[100];
        List<BigScreenBase> data = bigScreenService.selectArea(cityCode);
        for (int m = 0; m < data.size(); m++) {
            Area a = new Area();
            Area b = new Area();
            Area c = new Area();
            Area d = new Area();
            Area e = new Area();
            Area f = new Area();
            a.setValue(data.get(m).getVisualFirst());
            a.setName("一类");
            list2.add(0,a);
            b.setValue(data.get(m).getVisualSecond());
            b.setName("二类");
            list2.add(1,b);
            c.setValue(data.get(m).getVisualThird());
            c.setName("三类");
            list2.add(2,c);
            d.setValue(data.get(m).getVisualFourth());
            d.setName("四类");
            list2.add(3,d);
            e.setValue(data.get(m).getVisualFifth());
            e.setName("五类");
            list2.add(4,e);
            f.setValue(data.get(m).getVisualSixth());
            f.setName("六类");
            list2.add(5,f);
            o.put("name", data.get(m).getBaseDistrict());
            o.put("children",list2);
            o2.put("data",o);
            h =o2.values().toArray();
        }
        return h;
    }
}
