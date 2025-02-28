package job.catcher.restaurant.restaurant.domain;

import jakarta.persistence.*;
import job.catcher.restaurant.thumbnail.domain.Thumbnail;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name = "restaurant")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "google_id", nullable = true)
    private String googleId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "address", nullable = true)
    private String address;

    @Column(name = "latitude", nullable = false)
    private Double latitude; //위도

    @Column(name = "longitude", nullable = false)
    private Double longitude; //경도

    @Column(name = "geo_hash", nullable = true)
    private String geoHash;

    @Column(name = "rating", nullable = false)
    private Double rating;

    @Column(name = "review_count", nullable = false)
    private Integer reviewCount;

    @Column(name = "visited_review_count", nullable = true)
    private Integer visitedReviewCount;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "category", nullable = false)
    private Category category;

//    @ElementCollection
//    @CollectionTable(name = "restaurant_thumbnail", joinColumns = @JoinColumn(name = "restaurant_id"))
//    @AttributeOverride(name = "id", column = @Column(name = "thumbnail_id"))
    @Transient
    private List<Thumbnail> thumbnails = new ArrayList<>();

    @Builder
    public Restaurant(String googleId, String title, String address, Double latitude, Double longitude,
                      String geoHash, Double rating, Integer reviewCount, Integer visitedReviewCount, Category category) {
        this.googleId = googleId;
        this.title = title;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.geoHash = geoHash;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.visitedReviewCount = visitedReviewCount;
        this.category = category;
    }

    public void updateGeoHash(String geoHash) {
        this.geoHash = geoHash;
    }

    public void addThumbnail(Thumbnail thumbnail) {
        this.thumbnails.add(thumbnail);
    }

    public void updateCrawlingData(String title, String address, Double rating, Integer reviewCount, Integer visitedReviewCount) {
        this.title = title;
        this.address = address;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.visitedReviewCount = visitedReviewCount;
    }
}
