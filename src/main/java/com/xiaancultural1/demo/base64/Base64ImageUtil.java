package com.xiaancultural1.demo.base64;

import com.sun.imageio.plugins.common.ImageUtil;
import com.xiaancultural1.demo.mapper.Base64Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import sun.misc.BASE64Encoder;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Controller
public class Base64ImageUtil {
    @Autowired
    private Base64Mapper base64Mapper;


    @Transactional
//    @RequestMapping("/base64")
//    @ResponseBody
    public String base64() throws Exception {
       //添加base64码字符串开头格式
        String b="data:img/jpg;base64,";
        //遍历所有路径 本地文件地址
        String qianzhui ="D:\\1\\四类\\";
        List<File> m = new ArrayList<>();
        //获取照片文件
        m =readFile(qianzhui);
        //遍历文件
        for (File f1 : m) {
            //获得文件名
            String filename =f1.getName();
            //分割文件名后缀 只拿到文件名
            String baseName = filename.substring(0,filename.lastIndexOf("."));
            //   System.out.println(caselsh);
            //拼接base64码开头 + 转码 =获得全路径
            StringBuffer url = new StringBuffer();
            url.append(qianzhui);
            url.append(filename);
            String uu=url.toString();
            //循环获得base64码
            String strImg = GetImageStr(uu);
            //    System.out.println(strImg);
            StringBuffer a = new StringBuffer();
            a.append(b);
            a.append(strImg);
            String basePicture = a.toString();
           System.out.println(baseName);
           //调用插入语句的mapper
            base64Mapper.insertBase64(basePicture,baseName);
        }
        return  "成功";
    }
    //获取本地文件夹下的文件
    private static List<File> readFile(String fileDir) {
        List<File> fileList = new ArrayList<File>();
        File file = new File(fileDir);
        File[] files = file.listFiles();// 获取目录下的所有文件或文件夹
        if (files == null) {// 如果目录为空，直接退出
            return null;
        }

        // 遍历，目录下的所有文件
        for (File f : files) {
            if (f.isFile()) {
                fileList.add(f);
            } else if (f.isDirectory()) {
                System.out.println(f.getAbsolutePath());
                readFile(f.getAbsolutePath());
            }
        }
//        for (File f1 : fileList) {
//            System.out.println(f1.getName());
//        }
        return fileList;
    }


    // 读取本地图片获取输入流
    public static FileInputStream readImage(String path) throws IOException {
        return new FileInputStream(new File(path));
    }

    // 图片转化成base64字符串
    //图片文件转化为字节数组字符串，并对其进行Base64编码处理
    public static String GetImageStr(String imgPath) {// 将图片文件转化为字节数组字符串，并对其进行Base64编码处理
        String imgFile = imgPath;// 待处理的图片
        InputStream in = null;
        byte[] data = null;
        String encode = null; // 返回Base64编码过的字节数组字符串
        // 对字节数组Base64编码
        BASE64Encoder encoder = new BASE64Encoder();
        try {
            // 读取图片字节数组
            in = Base64ImageUtil.readImage(imgFile);
            data = new byte[in.available()];
            in.read(data);

            encode = encoder.encode(data);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                in.close();
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        return encode;
    }



}
