package com.xiaancultural1.demo.pojo;

//可视化模块需要的文地基本信息实体类
public class visualBase {
    private String baseName;

    public String getBaseName() {
        return baseName;
    }

    public void setBaseName(String baseName) {
        this.baseName = baseName;
    }

    public String getBaseDistrict() {
        return baseDistrict;
    }

    public void setBaseDistrict(String baseDistrict) {
        this.baseDistrict = baseDistrict;
    }

    public String getBasePoint() {
        return basePoint;
    }

    public void setBasePoint(String basePoint) {
        this.basePoint = basePoint;
    }

    public double getBaseArea() {
        return baseArea;
    }

    public void setBaseArea(double baseArea) {
        this.baseArea = baseArea;
    }

    public String getBaseClassfication() {
        return baseClassification;
    }

    public void setBaseClassfication(String baseClassfication) {
        this.baseClassification = baseClassfication;
    }

    private String baseDistrict;
    private String basePoint;
    private double baseArea;
    private String baseClassification;

}
