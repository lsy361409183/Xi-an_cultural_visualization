package com.xiaancultural1.demo.pojo;

public class CultureLand {
    private int cuId;//文地id
    private String cuName;//文地名称
    private String cuType;//文地类型
    private double cuLat;//纬度
    private double cuLon;//经度
    private String cuDistrict;//区
    private Double cuServiceCap;//服务半径，设定为面积大小
    private Double cuSDRatio;//文地的供需比，每个文地一个

    public int getCuId() {
        return cuId;
    }

    public void setCuId(int cuId) {
        this.cuId = cuId;
    }

    public String getCuName() {
        return cuName;
    }

    public void setCuName(String cuName) {
        this.cuName = cuName;
    }

    public String getCuType() {
        return cuType;
    }

    public void setCuType(String cuType) {
        this.cuType = cuType;
    }

    public double getCuLat() {
        return cuLat;
    }

    public void setCuLat(double cuLat) {
        this.cuLat = cuLat;
    }

    public double getCuLon() {
        return cuLon;
    }

    public void setCuLon(double cuLon) {
        this.cuLon = cuLon;
    }

    public String getCuDistrict() {
        return cuDistrict;
    }

    public void setCuDistrict(String cuDistrict) {
        this.cuDistrict = cuDistrict;
    }

    public Double getCuServiceCap() {
        return cuServiceCap;
    }

    public void setCuServiceCap(Double cuServiceCap) {
        this.cuServiceCap = cuServiceCap;
    }

    public Double getCuSDRatio() {
        return cuSDRatio;
    }

    public void setCuSDRatio(Double cuSDRatio) {
        this.cuSDRatio = cuSDRatio;
    }

    public CultureLand() {
    }

    public CultureLand(int cuId, String cuName, String cuType, double cuLat, double cuLon, String cuDistrict, Double cuServiceCap, Double cuSDRatio) {
        this.cuId = cuId;
        this.cuName = cuName;
        this.cuType = cuType;
        this.cuLat = cuLat;
        this.cuLon = cuLon;
        this.cuDistrict = cuDistrict;
        this.cuServiceCap = cuServiceCap;
        this.cuSDRatio = cuSDRatio;
    }

    @Override
    public String toString() {
        return "CultureLand{" +
                "cuId=" + cuId +
                ", cuName='" + cuName + '\'' +
                ", cuType='" + cuType + '\'' +
                ", cuLat=" + cuLat +
                ", cuLon=" + cuLon +
                ", cuDistrict='" + cuDistrict + '\'' +
                ", cuServiceCap=" + cuServiceCap +
                ", cuSDRatio=" + cuSDRatio +
                '}';
    }
}
