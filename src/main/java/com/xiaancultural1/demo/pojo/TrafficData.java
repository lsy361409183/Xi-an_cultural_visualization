package com.xiaancultural1.demo.pojo;

public class TrafficData {
    public Double getAccessibility() {
        return Accessibility;
    }

    public void setAccessibility(Double accessibility) {
        Accessibility = accessibility;
    }

    private Double Accessibility;
    public String getBaseName() {
        return baseName;
    }

    public void setBaseName(String baseName) {
        this.baseName = baseName;
    }

    private String baseName;

    public String getBasePoint() {
        return basePoint;
    }

    public void setBasePoint(String basePoint) {
        this.basePoint = basePoint;
    }


    private String basePoint;

    public Double getBaseLongitude() {
        return baseLongitude;
    }

    public void setBaseLongitude(Double baseLongitude) {
        this.baseLongitude = baseLongitude;
    }

    private Double baseLongitude;

    public Double getBaseLatitude() {
        return baseLatitude;
    }

    public void setBaseLatitude(Double baseLatitude) {
        this.baseLatitude = baseLatitude;
    }

    private Double baseLatitude;
}
