package com.xiaancultural1.demo.pojo;

public class CulturalPoint {
    private Integer gid;
    private String name;
    private String type;
    private String address;
    private double lat;
    private double lng;
    private String city;
    private String province;
    private String district;
    private double lon84;
    private double lan84;

    public Integer getGid() {
        return gid;
    }

    public void setGid(Integer gid) {
        this.gid = gid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLng() {
        return lng;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public double getLon84() {
        return lon84;
    }

    public void setLon84(double lon84) {
        this.lon84 = lon84;
    }

    public double getLan84() {
        return lan84;
    }

    public void setLan84(double lan84) {
        this.lan84 = lan84;
    }

    public CulturalPoint() {
    }

    public CulturalPoint(Integer gid, String name, String type, String address, double lat, double lng, String city, String province, String district, double lon84, double lan84) {
        this.gid = gid;
        this.name = name;
        this.type = type;
        this.address = address;
        this.lat = lat;
        this.lng = lng;
        this.city = city;
        this.province = province;
        this.district = district;
        this.lon84 = lon84;
        this.lan84 = lan84;
    }

    @Override
    public String toString() {
        return "CulturalPoint{" +
                "gid=" + gid +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", address='" + address + '\'' +
                ", lat=" + lat +
                ", lng=" + lng +
                ", city='" + city + '\'' +
                ", province='" + province + '\'' +
                ", district='" + district + '\'' +
                ", lon84=" + lon84 +
                ", lan84=" + lan84 +
                '}';
    }
}
