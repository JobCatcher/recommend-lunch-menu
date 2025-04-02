package job.catcher.restaurant.global.response;

import job.catcher.restaurant.global.util.GeoHashUtil;
import job.catcher.restaurant.restaurant.domain.Category;
import job.catcher.restaurant.restaurant.domain.Restaurant;
import lombok.Builder;

import java.io.Serializable;

@Builder
public record RestaurantCrawlingDto(
        String googleId,
        String title,
        String address,
        double latitude,
        double longitude,
        Double rating,
        Integer reviewCount,
        Integer visitedReviewCount
) implements Serializable {
    public Restaurant toEntity() {
        return Restaurant.builder()
                .googleId(this.googleId)
                .title(this.title)
                .address(this.address)
                .latitude(this.latitude)
                .longitude(this.longitude)
                .geoHash(GeoHashUtil.encode(this.latitude, this.longitude, 6))
                .rating(this.rating != null ? this.rating : 0.0)
                .reviewCount(this.reviewCount != null ? this.reviewCount : 0)
                .visitedReviewCount(this.visitedReviewCount != null ? this.visitedReviewCount : 0)
                .category(Category.KOREA)
                .build();
    }
}
