package job.catcher.restaurant.global.response;

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

}
