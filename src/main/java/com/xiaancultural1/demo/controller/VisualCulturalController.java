package com.xiaancultural1.demo.controller;

import com.xiaancultural1.demo.pojo.MapData;
import com.xiaancultural1.demo.pojo.visualBase;
import com.xiaancultural1.demo.service.VisualCulturalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class VisualCulturalController {
    @Autowired
    private VisualCulturalService visualCulturalService;

    //拿到geojson，加载地图
    @RequestMapping("/getMapData")
    @ResponseBody
    public String selectJson(@RequestParam(value = "mapId",required = false)Integer mapId){
        List<MapData> mapData = visualCulturalService.selectJson(mapId);
        List<String> json=mapData.stream().map(MapData::getMapJson).collect(Collectors.toList());
        //System.out.println(json.toString());
        return json.toString();
      // return visualCulturalService.selectJson(mapId);
    };
    //查询出文地的基本信息：区域、类别、名称、位置、面积
    @RequestMapping("/getVisualData")
    @ResponseBody
    public List<visualBase> selectAllInfo(){
        return visualCulturalService.selectAllInfo();
    }

}
