package com.xiaancultural1.demo.controller;

import java.io.*;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;


public class ImportKDE {
    public static String getKDE(List<Double> lng, List<Double> lat){
        String line= null;

        Integer list1Size;

        list1Size = lng.size();

        //将list1.list2合并
        lng.addAll(lat);
        //将size加到list1最后
        Double list1size =Double.valueOf(list1Size);
        lng.add(list1size);
        System.out.println(lng);
        try {
            Process process = Runtime.getRuntime().exec("python ./src/main/java/com/xiaancultural1/demo/utils/test.py"+" "+lng);
            InputStreamReader ir = new InputStreamReader(process.getInputStream());
            BufferedReader in = new BufferedReader(ir);
            line = in.readLine();
            System.out.println("line========="+line);
            ir.close();
            in.close();

        } catch (IOException e) {
            e.printStackTrace();
        }

        return line;

    }

    public static void main(String args[]) {


    }
}
