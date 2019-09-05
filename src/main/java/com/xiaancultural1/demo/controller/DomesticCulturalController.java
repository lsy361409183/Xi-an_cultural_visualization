package com.xiaancultural1.demo.controller;


import com.xiaancultural1.demo.pojo.DomesticData;
import com.xiaancultural1.demo.service.DomesticCulturalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
public class DomesticCulturalController {
    @Autowired
    private DomesticCulturalService domesticCulturalService;
    @RequestMapping("/getDomesticData")
    @ResponseBody

    public List<DomesticData> test() throws IOException{
        List<DomesticData> DomesticDatas = domesticCulturalService.getDomesticData();
        return DomesticDatas;
    }

}
