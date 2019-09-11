package com.xiaancultural1.demo.controller;

import com.xiaancultural1.demo.pojo.HistogramData;
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
    @Autowired(required = true)
    private VisualCulturalService visualCulturalService;

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

    ;

    //查询出文地的基本信息：区域、类别、名称、位置、面积
    @RequestMapping("/getVisualData")
    @ResponseBody
    public List<visualBase> selectAllInfo() {
        return visualCulturalService.selectAllInfo();
    }

    //区域和类别筛选
    @RequestMapping("/getFilterData")
    @ResponseBody
    public List<visualBase> selectInfo(@RequestParam(value = "baseDistrict", required = false) String baseDistrict,
                                       @RequestParam(value = "baseClassification", required = false) String baseClassification,
                                       HttpServletRequest request) throws UnsupportedEncodingException {
        request.setCharacterEncoding("UTF-8");
         System.out.println("区域："+baseDistrict+"类别:"+baseClassification);

//        String[] str=baseClassification.split(",");
//        for(int i=0;i<str.length;i++ ){
//            str[i] = str[i].replaceAll(str[i],"'" + str[i] + "'");
//        }
//        String s = "";
//        for(int a=0;a<str.length;a++)
//            for (String string: str) {
//                s = s + str[a];
//            }
//        System.out.println("改变后的类别:" +s);
        //   String diatrict ="'" . join("','", baseDistrict) . "'";
//        String s = Pattern.compile
//                ("\\b([\\w\\W])\\b").matcher(baseClassification.toString()).replaceAll("'$1'");
//         List<String> b=  new ArrayList<String>();
//        for (String string:baseClassification){
//            b.add("'"+string+"'");
//        }

        //JSONParser(baseClassification);
        if (baseDistrict.equals("'全部'") && baseClassification.equals("'全部'")) {
            return visualCulturalService.selectAllInfo();
        } else if (baseDistrict.equals("'全部'")) {
//            JSONArray array =JSONArray.fromObject(baseClassification);
//            System.out.println("改变后的类别:" +array);
            return visualCulturalService.selectInfoByType(baseClassification);
        } else if (baseClassification.equals("'全部'")) {
            return visualCulturalService.selectInfoByRegion(baseDistrict);
        } else {
            return visualCulturalService.selectInfo(baseDistrict, baseClassification);
        }
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
}
