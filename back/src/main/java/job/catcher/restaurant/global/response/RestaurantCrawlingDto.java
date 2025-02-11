package job.catcher.restaurant.global.response;

import com.querydsl.core.annotations.QueryProjection;
import job.catcher.restaurant.restaurant.domain.Restaurant;
import job.catcher.restaurant.thumbnail.domain.Thumbnail;
import lombok.Builder;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

//@Builder
//public record RestaurantCrawlingDto(
//        String title,
//        double latitude,
//        double longitude,
//        Double rating,
//        int reviewCount
//) {
//
//}

@Builder
public record RestaurantCrawlingDto(
        String statusText,
        int status,
        String message,
        List<data> data
) implements Serializable {

    @Builder
    public record data(
            long restaurantId,
            String title,
            double latitude,
            double longitude,
            Double rating,
            int reviewCount,
            List<ThumbnailResponseDto> thumbnails
    ) implements Serializable {

        @Builder
        public record ThumbnailResponseDto(
                long thumbnailId,
                String url
        ) implements Serializable {

        }
    }
}