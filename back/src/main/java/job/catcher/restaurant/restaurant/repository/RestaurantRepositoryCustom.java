package job.catcher.restaurant.restaurant.repository;

import job.catcher.restaurant.restaurant.dto.RestaurantResponseDto;

import java.util.List;

public interface RestaurantRepositoryCustom {

    List<RestaurantResponseDto> findRestaurantInRangeV2(List<String> geoHashs);
}
