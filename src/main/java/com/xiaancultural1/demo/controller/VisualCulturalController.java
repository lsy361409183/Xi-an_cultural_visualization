package com.xiaancultural1.demo.controller;

import com.xiaancultural1.demo.mapper.VisualCulturalMapper;
import com.xiaancultural1.demo.pojo.HistogramData;
import com.xiaancultural1.demo.pojo.MapData;
import com.xiaancultural1.demo.pojo.geoBase;
import com.xiaancultural1.demo.pojo.visualBase;
import com.xiaancultural1.demo.service.VisualCulturalService;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class VisualCulturalController {
    @Autowired(required = true)
    private VisualCulturalService visualCulturalService;

    //设置传参的对象
    public class BaseGeojson{

        private List<visualBase> pointData;

        public List<visualBase> getPointData() {
            return pointData;
        }

        public void setPointData(List<visualBase> pointData) {
            this.pointData = pointData;
        }


        public List<String> getPointArea() {
            return pointArea;
        }

        public void setPointArea(List<String> pointArea) {
            this.pointArea = pointArea;
        }

        private List<String> pointArea;
    }

    //拿到geojson，加载地图
    @RequestMapping("/getMapData")
    @ResponseBody
    public String selectJson(@RequestParam(value = "mapId", required = false) Integer mapId) {
        List<MapData> mapData = visualCulturalService.selectJson(mapId);
        List<String> json = mapData.stream().map(MapData::getMapJson).collect(Collectors.toList());
        //System.out.println(json.toString());
        return StringUtils.strip(json.toString(), "[]");
        // return visualCulturalService.selectJson(mapId);
    }



    //查询出文地的基本信息：区域、类别、名称、位置、面积
    @RequestMapping("/getVisualData")
    @ResponseBody
    public BaseGeojson selectAllInfo() {
        //查询出所有的数据
        List<visualBase> all =visualCulturalService.selectAllInfo();
        List<geoBase> geo = visualCulturalService.selectAllGeojson();
        List<String> json = geo.stream().map(geoBase::getAreaGeojson).collect(Collectors.toList());
//        String geojson= StringUtils.strip(json.toString(), "[]");
        //创建需要的数据格式
        BaseGeojson data = new BaseGeojson();
//        List<String> aaa= new ArrayList<>();
//        for (int i=0;i<geo.size();i++) {
//            String a = geo.get(i).getAreaGeojson();
//            aaa.add(i,a);
//        }
        data.setPointData(all);
        data.setPointArea(json);
        return data;

    }

    //区域和类别筛选
    @RequestMapping("/getFilterData")
    @ResponseBody
    public BaseGeojson selectInfo(@RequestParam(value = "baseDistrict", required = false) String baseDistrict,
                                       @RequestParam(value = "baseClassification", required = false) String baseClassification,
                                       HttpServletRequest request) throws UnsupportedEncodingException {
        request.setCharacterEncoding("UTF-8");
         System.out.println("区域："+baseDistrict+"类别:"+baseClassification);
        //创建需要的数据格式
        BaseGeojson data = new BaseGeojson();
        List<visualBase> all =new ArrayList<>();
        List<geoBase> geo = new ArrayList<>();
        List<String>  json=new ArrayList<>();
        if (baseDistrict.equals("'全部'") && baseClassification.equals("'全部'")) {
            //查询出所有的数据
            all =visualCulturalService.selectAllInfo();
            geo = visualCulturalService.selectAllGeojson();
//        String geojson= StringUtils.strip(json.toString(), "[]");
            data.setPointData(all);
            data.setPointArea(json);
        } else if (baseDistrict.equals("'全部'")) {
            all =visualCulturalService.selectInfoByType(baseClassification);
            geo = visualCulturalService.selectTypeGeojson(baseClassification);
            System.out.println("类别进入了"+geo.get(0).getAreaGeojson());
        } else if (baseClassification.equals("'全部'")) {
            all =visualCulturalService.selectInfoByRegion(baseDistrict);
            geo = visualCulturalService.selectRegionGeojson(baseDistrict);
            System.out.println("区域进入了----------------------");
        } else {
            all =visualCulturalService.selectInfo(baseDistrict,baseClassification);
            geo = visualCulturalService.selectFileterGeojson(baseDistrict,baseClassification);
            System.out.println("类别区域进入了"+geo.get(0).getAreaGeojson());
        }
        List<String> aaa= new ArrayList<>();
        if (geo!=null) {
            for (int i=0;i<geo.size();i++) {
                String a = geo.get(i).getAreaGeojson();
                aaa.add(i,a);
            }
        }
        else{
            aaa=null;
        }
        data.setPointData(all);
        data.setPointArea(aaa);
        return data;
    }

    /**
     * 关键字模糊查询
     * baseName             搜索关键字
     * baseDistrict           区域
     * */
    @RequestMapping("/getSearchData")
    @ResponseBody
    public List<visualBase> selectInfoBySearchText(@RequestParam(value = "baseName", required = false) String baseName,
                                                   @RequestParam(value = "baseDistrict", required = false) String baseDistrict,
                                                   HttpServletRequest request) throws UnsupportedEncodingException {
        request.setCharacterEncoding("UTF-8");
        return visualCulturalService.selectInfoBySearchText(baseName, baseDistrict);
    }

    //堆叠柱状图
    @RequestMapping("/getHistogramData")
    @ResponseBody
    public List<HistogramData> selectHistogramData(){
        return visualCulturalService.selectHistogramData();
    }


    //条件筛选堆叠柱状图
    @RequestMapping("/getAreaData")
    @ResponseBody
    public List<HistogramData> selectAreaData(@Param("baseDistrict")String baseDistrict,
                                       @Param("baseClassification")String baseClassification){
        return visualCulturalService.selectAreaData(baseDistrict,baseClassification);
    }
}
