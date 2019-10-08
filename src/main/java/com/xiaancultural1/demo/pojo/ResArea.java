package com.xiaancultural1.demo.pojo;

public class ResArea {
    private int jmId;//小区id
    private String jmName;//小区名称
    private double jmLatitude;//小区经度
    private double jmLongitude;//小区纬度
    private double jmAF;//计算结束的可达性值
    private int jmPeople;//小区的人口数

    public int getJmId() {
        return jmId;
    }

    public void setJmId(int jmId) {
        this.jmId = jmId;
    }

    public String getJmName() {
        return jmName;
    }

    public void setJmName(String jmName) {
        this.jmName = jmName;
    }

    public double getJmLatitude() {
        return jmLatitude;
    }

    public void setJmLatitude(double jmLatitude) {
        this.jmLatitude = jmLatitude;
    }

    public double getJmLongitude() {
        return jmLongitude;
    }

    public void setJmLongitude(double jmLongitude) {
        this.jmLongitude = jmLongitude;
    }

    public double getJmAF() {
        return jmAF;
    }

    public void setJmAF(double jmAF) {
        this.jmAF = jmAF;
    }

    public int getJmPeople() {
        return jmPeople;
    }

    public void setJmPeople(int jmPeople) {
        this.jmPeople = jmPeople;
    }

    public ResArea() {
    }

    public ResArea(int jmId, String jmName, double jmLatitude, double jmLongitude, double jmAF, int jmPeople) {
        this.jmId = jmId;
        this.jmName = jmName;
        this.jmLatitude = jmLatitude;
        this.jmLongitude = jmLongitude;
        this.jmAF = jmAF;
        this.jmPeople = jmPeople;
    }

    @Override
    public String toString() {
        return "ResArea{" +
                "jmId=" + jmId +
                ", jmName='" + jmName + '\'' +
                ", jmLatitude=" + jmLatitude +
                ", jmLongitude=" + jmLongitude +
                ", jmAF=" + jmAF +
                ", jmPeople=" + jmPeople +
                '}';
    }
}
