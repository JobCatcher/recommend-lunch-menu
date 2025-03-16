package job.catcher.restaurant.restaurant.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record RestaurantRequestDto(
        List<Long> restaurantIds
) {
}
