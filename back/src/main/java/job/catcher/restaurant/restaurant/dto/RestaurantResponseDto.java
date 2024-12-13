package job.catcher.restaurant.restaurant.dto;

import job.catcher.restaurant.restaurant.domain.Restaurant;
import job.catcher.restaurant.thumbnail.domain.Thumbnail;
import lombok.Builder;

import java.util.List;

@Builder
public record RestaurantResponseDto(
        long restaurantId,
        String title,
        double latitude,
        double longitude,
        Double rating,
        int reviewCount,
        List<ThumbnailResponseDto> thumbnails
) {
    public static RestaurantResponseDto from(Restaurant restaurant, List<ThumbnailResponseDto> thumbnails) {
        return RestaurantResponseDto.builder()
                .restaurantId(restaurant.getId())
                .title(restaurant.getTitle())
                .latitude(restaurant.getLatitude())
                .longitude(restaurant.getLongitude())
                .rating(restaurant.getRating())
                .reviewCount(restaurant.getReviewCount())
                .thumbnails(thumbnails)
                .build();
    }

    @Builder
    public record ThumbnailResponseDto(
            long thumbnailId,
            String url
    ) {
        public static ThumbnailResponseDto from(Thumbnail thumbnail) {
            return ThumbnailResponseDto.builder()
                    .thumbnailId(thumbnail.getId())
                    .url(thumbnail.getUrl())
                    .build();
        }
    }
}
