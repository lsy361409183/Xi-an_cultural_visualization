package com.xiaancultural1.demo.controller;


import com.xiaancultural1.demo.pojo.visualBase;
import com.xiaancultural1.demo.service.UserDefinedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
public class UserDefinedController {
    @Autowired
    private UserDefinedService userDefinedService;
    @RequestMapping("/getUserDefineData")
    @ResponseBody

    public List<visualBase> test() throws IOException{
        List<visualBase> visualBases = userDefinedService.selectAllInfo();
        return visualBases;
    }

}
