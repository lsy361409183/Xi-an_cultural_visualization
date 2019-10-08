package com.xiaancultural1.demo.controller;


import com.xiaancultural1.demo.pojo.ResArea;
import com.xiaancultural1.demo.service.ResCulService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ResCulController {
    @Autowired
    private ResCulService resCulService;

    @RequestMapping("/res")
    @ResponseBody
    public List<ResArea> ResLists(){
        List<ResArea> resAreas = resCulService.selectAllAccRes();
        for (int i = 0; i < resAreas.size(); i++) {
            System.out.println(resAreas.get(i));
        }
        return resCulService.selectAllAccRes();
    }

}
