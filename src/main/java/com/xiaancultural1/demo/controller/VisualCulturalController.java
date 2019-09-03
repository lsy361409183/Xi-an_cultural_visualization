package com.xiaancultural1.demo.controller;

import com.xiaancultural1.demo.pojo.MapData;
import com.xiaancultural1.demo.pojo.visualBase;
import com.xiaancultural1.demo.service.VisualCulturalService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class VisualCulturalController {
    @Autowired(required=true)
    private VisualCulturalService visualCulturalService;

    //拿到geojson，加载地图
    @RequestMapping("/getMapData")
    @ResponseBody
    public String selectJson(@RequestParam(value = "mapId",required = false)Integer mapId){
        List<MapData> mapData = visualCulturalService.selectJson(mapId);
        List<String> json=mapData.stream().map(MapData::getMapJson).collect(Collectors.toList());
        //System.out.println(json.toString());
        return StringUtils.strip(json.toString(),"[]");
      // return visualCulturalService.selectJson(mapId);
    };
    //查询出文地的基本信息：区域、类别、名称、位置、面积
    @RequestMapping("/getVisualData")
    @ResponseBody
    public List<visualBase> selectAllInfo(){
        return visualCulturalService.selectAllInfo();
    }

    //区域和类别筛选
    @RequestMapping("/getFilterData")
    @ResponseBody
    public List<visualBase> selectInfo(@RequestParam(value = "baseDistrict",required = false)String baseDistrict,
                                       @RequestParam(value = "baseClassification",required = false)String baseClassification,
                                       HttpServletRequest request) throws UnsupportedEncodingException {
        request.setCharacterEncoding("UTF-8");

        if(baseDistrict.equals("'全部'")&&baseClassification.equals("'全部'"))
        {
            return visualCulturalService.selectAllInfo();
        }
        else if (baseDistrict.equals("'全部'")){
            return visualCulturalService.selectInfoByType(baseClassification);
        }
        else if (baseClassification.equals("'全部'")){
            return visualCulturalService.selectInfoByRegion(baseDistrict);
        }
        else{
            return visualCulturalService.selectInfo(baseDistrict,baseClassification);
        }
    }

}
