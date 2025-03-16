package job.catcher.restaurant.restaurant.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record RestaurantSyncResponseDto(
        List<RestaurantResponseDto> restaurants,
        List<Long> removeRestaurantIds
) {
    public static RestaurantSyncResponseDto from(List<RestaurantResponseDto> restaurants, List<Long> removeRestaurantIds) {
        return RestaurantSyncResponseDto.builder()
                .restaurants(restaurants)
                .removeRestaurantIds(removeRestaurantIds)
                .build();
    }
}
