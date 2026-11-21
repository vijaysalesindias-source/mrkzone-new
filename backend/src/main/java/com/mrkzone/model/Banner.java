package com.mrkzone.model;

import jakarta.persistence.*;

@Entity
@Table(name = "banners")
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String subtitle;

    @Column(nullable = false, length = 1000)
    private String imageUrl;

    private String targetUrl = "/products";

    private String buttonText = "Shop Now";

    private String tag = "Featured Deal";

    private int displayOrder = 0;

    private boolean active = true;

    public Banner() {}

    public Banner(String title, String subtitle, String imageUrl, String targetUrl, String buttonText, String tag, int displayOrder) {
        this.title = title;
        this.subtitle = subtitle;
        this.imageUrl = imageUrl;
        this.targetUrl = targetUrl;
        this.buttonText = buttonText;
        this.tag = tag;
        this.displayOrder = displayOrder;
        this.active = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getTargetUrl() { return targetUrl; }
    public void setTargetUrl(String targetUrl) { this.targetUrl = targetUrl; }
    public String getButtonText() { return buttonText; }
    public void setButtonText(String buttonText) { this.buttonText = buttonText; }
    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }
    public int getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
