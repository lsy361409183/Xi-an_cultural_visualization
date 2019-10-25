package com.xiaancultural1.demo.controller;



import com.xiaancultural1.demo.pojo.TrafficData;
import net.sf.json.JSONArray;
import net.sf.json.JSONNull;
import net.sf.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;


public class GetDistance {
    public static Double getDistance(String startLonLat, String endLonLat,String key) {
        //返回起始地startAddr与目的地endAddr之间的距离，单位：米
        Double result = 0.00;
        String queryUrl = "http://restapi.amap.com/v3/distance?key=" + key + "&origins=" + startLonLat + "&destination=" + endLonLat;
        String queryResult = getResponse(queryUrl);
        JSONObject jo = JSONObject.fromObject(queryResult);
        // if(!JSONNull.getInstance().equals(jo.get("orderList"))){
        JSONArray ja = jo.getJSONArray("results");
        Object obj = JSONObject.fromObject(ja.getString(0)).get("distance");
        if (obj == null) {
            return result;
        }
        result = Double.parseDouble(obj.toString());
        //  }
        return result;
    }
    private static String getResponse(String serverUrl){
        //用JAVA发起http请求，并返回json格式的结果
        StringBuffer result = new StringBuffer();
        try {
            URL url = new URL(serverUrl);
            URLConnection conn = url.openConnection();
            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));

            String line;
            while((line = in.readLine()) != null){
                result.append(line);
            }
            in.close();

        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result.toString();
    }

    public static void main(String[] args){
        String startLonLat="116.413731,39.979324";
        String endLonLat="116.417537,39.97722";
        String key="91ab4abc30069c37dc209791dd1ac224";

        System.out.println(startLonLat);
        System.out.println(endLonLat);
        Double dis = getDistance(startLonLat,endLonLat,key);
        System.out.println(dis);
    }
}