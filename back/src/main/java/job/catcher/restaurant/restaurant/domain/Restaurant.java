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

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "latitude", nullable = false)
    private Double latitude; //위도

    @Column(name = "longitude", nullable = false)
    private Double longitude; //경도

    @Column(name = "rating", nullable = false)
    private Double rating;

    @Column(name = "review_count", nullable = false)
    private Integer reviewCount;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "category", nullable = false)
    private Category category;

    @Column(name = "thumbnails")
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Thumbnail> thumbnails = new ArrayList<>();

    @Builder
    public Restaurant(String title, Double latitude, Double longitude, Double rating, Integer reviewCount, Category category) {
        this.title = title;
        this.latitude = latitude;
        this.longitude = longitude;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.category = category;
    }
}
