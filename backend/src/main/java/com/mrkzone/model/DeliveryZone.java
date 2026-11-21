package com.mrkzone.model;

import jakarta.persistence.*;

@Entity
@Table(name = "delivery_zones")
public class DeliveryZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String zoneName; // Local (Mumbai), Metro / Maharashtra, Rest of India, Remote

    private String description;

    private String originPincode = "400072";

    // Matching prefixes separated by commas, e.g. "400" for Mumbai, "401,402,403,41" for regional Maharashtra
    @Column(length = 1000)
    private String pincodePrefixes;

    private Integer estimatedDaysMin = 1;
    private Integer estimatedDaysMax = 3;

    private Double standardShippingFee = 40.0;
    private Double expressShippingFee = 99.0;
    private boolean expressAvailable = true;

    private Double freeShippingThreshold = 499.0;

    private boolean active = true;

    public DeliveryZone() {}

    public DeliveryZone(String zoneName, String description, String pincodePrefixes, Integer estimatedDaysMin, Integer estimatedDaysMax, Double standardShippingFee, Double expressShippingFee, boolean expressAvailable) {
        this.zoneName = zoneName;
        this.description = description;
        this.pincodePrefixes = pincodePrefixes;
        this.estimatedDaysMin = estimatedDaysMin;
        this.estimatedDaysMax = estimatedDaysMax;
        this.standardShippingFee = standardShippingFee;
        this.expressShippingFee = expressShippingFee;
        this.expressAvailable = expressAvailable;
        this.freeShippingThreshold = 499.0;
        this.active = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getZoneName() { return zoneName; }
    public void setZoneName(String zoneName) { this.zoneName = zoneName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getOriginPincode() { return originPincode; }
    public void setOriginPincode(String originPincode) { this.originPincode = originPincode; }
    public String getPincodePrefixes() { return pincodePrefixes; }
    public void setPincodePrefixes(String pincodePrefixes) { this.pincodePrefixes = pincodePrefixes; }
    public Integer getEstimatedDaysMin() { return estimatedDaysMin; }
    public void setEstimatedDaysMin(Integer estimatedDaysMin) { this.estimatedDaysMin = estimatedDaysMin; }
    public Integer getEstimatedDaysMax() { return estimatedDaysMax; }
    public void setEstimatedDaysMax(Integer estimatedDaysMax) { this.estimatedDaysMax = estimatedDaysMax; }
    public Double getStandardShippingFee() { return standardShippingFee; }
    public void setStandardShippingFee(Double standardShippingFee) { this.standardShippingFee = standardShippingFee; }
    public Double getExpressShippingFee() { return expressShippingFee; }
    public void setExpressShippingFee(Double expressShippingFee) { this.expressShippingFee = expressShippingFee; }
    public boolean isExpressAvailable() { return expressAvailable; }
    public void setExpressAvailable(boolean expressAvailable) { this.expressAvailable = expressAvailable; }
    public Double getFreeShippingThreshold() { return freeShippingThreshold; }
    public void setFreeShippingThreshold(Double freeShippingThreshold) { this.freeShippingThreshold = freeShippingThreshold; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
