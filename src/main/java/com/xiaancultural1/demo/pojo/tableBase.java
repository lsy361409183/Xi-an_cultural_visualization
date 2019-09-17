package com.xiaancultural1.demo.pojo;

public class tableBase {
    private String baseDistrict;
    private String baseDistrictId;
    private int baseId;
    private String baseName;
    private String baseRegion;
    private String baseArea;
    private String baseDate;
    private String basePlaneform;
    private String baseClassification;
    private String baseBasis;
    private String baseUnit;
    private String baseRemarks;
    private double baseLatitude;
    private double baseLongitude;
    private double baseLatandlon;
    private String basePicture;

    @Override
    public String toString() {
        return "tableBase{" +
                "baseDistrict='" + baseDistrict + '\'' +
                ", baseDistrictId='" + baseDistrictId + '\'' +
                ", baseId=" + baseId +
                ", baseName='" + baseName + '\'' +
                ", baseRegion='" + baseRegion + '\'' +
                ", baseArea='" + baseArea + '\'' +
                ", baseDate='" + baseDate + '\'' +
                ", basePlaneform='" + basePlaneform + '\'' +
                ", baseClassification='" + baseClassification + '\'' +
                ", baseBasis='" + baseBasis + '\'' +
                ", baseUnit='" + baseUnit + '\'' +
                ", baseRemarks='" + baseRemarks + '\'' +
                ", baseLatitude=" + baseLatitude +
                ", baseLongitude=" + baseLongitude +
                ", baseLatandlon=" + baseLatandlon +
                ", basePicture='" + basePicture + '\'' +
                '}';
    }

    public tableBase() {
    }

    public tableBase(String baseDistrict, String baseDistrictId, int baseId, String baseName, String baseRegion, String baseArea, String baseDate, String basePlaneform, String baseClassification, String baseBasis, String baseUnit, String baseRemarks, double baseLatitude, double baseLongitude, double baseLatandlon, String basePicture) {
        this.baseDistrict = baseDistrict;
        this.baseDistrictId = baseDistrictId;
        this.baseId = baseId;
        this.baseName = baseName;
        this.baseRegion = baseRegion;
        this.baseArea = baseArea;
        this.baseDate = baseDate;
        this.basePlaneform = basePlaneform;
        this.baseClassification = baseClassification;
        this.baseBasis = baseBasis;
        this.baseUnit = baseUnit;
        this.baseRemarks = baseRemarks;
        this.baseLatitude = baseLatitude;
        this.baseLongitude = baseLongitude;
        this.baseLatandlon = baseLatandlon;
        this.basePicture = basePicture;
    }

    public String getBaseDistrict() {
        return baseDistrict;
    }

    public void setBaseDistrict(String baseDistrict) {
        this.baseDistrict = baseDistrict;
    }

    public String getBaseDistrictId() {
        return baseDistrictId;
    }

    public void setBaseDistrictId(String baseDistrictId) {
        this.baseDistrictId = baseDistrictId;
    }

    public int getBaseId() {
        return baseId;
    }

    public void setBaseId(int baseId) {
        this.baseId = baseId;
    }

    public String getBaseName() {
        return baseName;
    }

    public void setBaseName(String baseName) {
        this.baseName = baseName;
    }

    public String getBaseRegion() {
        return baseRegion;
    }

    public void setBaseRegion(String baseRegion) {
        this.baseRegion = baseRegion;
    }

    public String getBaseArea() {
        return baseArea;
    }

    public void setBaseArea(String baseArea) {
        this.baseArea = baseArea;
    }

    public String getBaseDate() {
        return baseDate;
    }

    public void setBaseDate(String baseDate) {
        this.baseDate = baseDate;
    }

    public String getBasePlaneform() {
        return basePlaneform;
    }

    public void setBasePlaneform(String basePlaneform) {
        this.basePlaneform = basePlaneform;
    }

    public String getBaseClassification() {
        return baseClassification;
    }

    public void setBaseClassification(String baseClassification) {
        this.baseClassification = baseClassification;
    }

    public String getBaseBasis() {
        return baseBasis;
    }

    public void setBaseBasis(String baseBasis) {
        this.baseBasis = baseBasis;
    }

    public String getBaseUnit() {
        return baseUnit;
    }

    public void setBaseUnit(String baseUnit) {
        this.baseUnit = baseUnit;
    }

    public String getBaseRemarks() {
        return baseRemarks;
    }

    public void setBaseRemarks(String baseRemarks) {
        this.baseRemarks = baseRemarks;
    }

    public double getBaseLatitude() {
        return baseLatitude;
    }

    public void setBaseLatitude(double baseLatitude) {
        this.baseLatitude = baseLatitude;
    }

    public double getBaseLongitude() {
        return baseLongitude;
    }

    public void setBaseLongitude(double baseLongitude) {
        this.baseLongitude = baseLongitude;
    }

    public double getBaseLatandlon() {
        return baseLatandlon;
    }

    public void setBaseLatandlon(double baseLatandlon) {
        this.baseLatandlon = baseLatandlon;
    }

    public String getBasePicture() {
        return basePicture;
    }

    public void setBasePicture(String basePicture) {
        this.basePicture = basePicture;
    }
}
