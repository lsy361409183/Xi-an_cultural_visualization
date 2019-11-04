package com.xiaancultural1.demo.controller;

import java.io.*;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.python.core.PyObject;
import org.python.core.PyInteger;
import org.python.core.PyArray;
import org.python.core.PyFunction;
import org.python.util.PythonInterpreter;

public class ImportKDE {
    public static String getKDE(){
        String line= null;
//        Properties props = new Properties();
//        props.put("python.home", "path to the Lib folder");
//        props.put("python.console.encoding", "UTF-8");
//        props.put("python.security.respectJavaAccessibility", "false");
//        props.put("python.import.site", "false");
//        Properties preprops = System.getProperties();
//        PythonInterpreter.initialize(preprops, props, new String[0]);
//
//        PythonInterpreter interpreter = new PythonInterpreter();
//        interpreter.execfile("src/main/java/com/xiaancultural1/demo/utils/test.py");
//        PyFunction func = (PyFunction) interpreter.get("adder",
//                PyFunction.class);

        //首先定义两个list，赋值。

        List<Double> list1 = new ArrayList<>();
        List<Double> list2 = new ArrayList<>();
//        Integer list1Size=null;
        //给list1赋值
        list1.add(108.822154);
        list1.add(108.821396);
        //给list2赋值
        list2.add(34.248492);
        list2.add(34.249188);


        //得到第一个list的size，传入脚本中，方便分割参数

        //将list1.list2合并
        list1.addAll(list2);
        //将size加到list1最后
//        Double a =Double.valueOf(list1Size);
//        list1.add(a);
//        System.out.println(list1);
//        String pythonPath="python E:\\python364\\python.exe";
//        String filePath= "com/xiaancultural1/demo/utils/test.py";
        try {
            Process process = Runtime.getRuntime().exec("python ./src/main/java/com/xiaancultural1/demo/utils/test.py"+" "+list1);
            InputStreamReader ir = new InputStreamReader(process.getInputStream());
            BufferedReader in = new BufferedReader(ir);
            line = in.readLine();
            System.out.println("line========="+line);
            ir.close();
            in.close();
//            int re=process.waitFor();
//            System.out.println(re==1?"----状态码1----运行失败":"----状态码0----运行成功");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return line;

    }

    public static void main(String args[]) {

//        getKDE();
        System.out.println("99999"+getKDE());

    }
}
