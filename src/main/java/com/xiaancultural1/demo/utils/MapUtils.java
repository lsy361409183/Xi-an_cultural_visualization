package com.xiaancultural1.demo.utils;

public class MapUtils {
    private static double rad(double d) {
        return d * Math.PI / 180.00; // 角度转换成弧度
    }

    /*
     * 根据经纬度计算两点之间的距离（单位米）
     */
    public static double algorithm(double longitude1, double latitude1, double longitude2, double latitude2) {

        double Lat1 = rad(latitude1); // 纬度

        double Lat2 = rad(latitude2);

        double a = Lat1 - Lat2;// 两点纬度之差

        double b = rad(longitude1) - rad(longitude2); // 经度之差

        double s = 2 * Math.asin(Math

                .sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(Lat1) * Math.cos(Lat2) * Math.pow(Math.sin(b / 2), 2)));// 计算两点距离的公式

        s = s * 6378137.0;// 弧长乘地球半径（半径为米）

        s = Math.round(s * 10000d) / 10000d;// 精确距离的数值
        // 四舍五入 保留一位小数
        //DecimalFormat df = new DecimalFormat("#.0");

        return s;

    }
}
