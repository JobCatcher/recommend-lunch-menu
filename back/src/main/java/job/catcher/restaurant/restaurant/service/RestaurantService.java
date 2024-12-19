package job.catcher.restaurant.restaurant.service;

import job.catcher.restaurant.global.util.GeoHashUtil;
import job.catcher.restaurant.restaurant.domain.Restaurant;
import job.catcher.restaurant.restaurant.dto.RestaurantResponseDto;
import job.catcher.restaurant.restaurant.repository.RestaurantRepository;
import job.catcher.restaurant.thumbnail.domain.Thumbnail;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public List<RestaurantResponseDto> searchRestaurantV1(double latitude, double longitude) {
        List<String> geoHashs = GeoHashUtil.getNeighbors(latitude, longitude, 6);
        List<Object[]> results = restaurantRepository.findRestaurantInRangeV1(geoHashs);
        Map<Long, Restaurant> restaurantMap = new LinkedHashMap<>();

        for (Object[] result : results) {
            Restaurant restaurant = (Restaurant) result[0];
            Thumbnail thumbnail = (Thumbnail) result[1];
            restaurantMap.putIfAbsent(restaurant.getId(), restaurant);
            if (thumbnail != null) {
                restaurantMap.get(restaurant.getId()).addThumbnail(thumbnail);
            }
        }

        return restaurantMap.values().stream()
                .map(restaurant -> {
                    List<Thumbnail> thumbnails = restaurant.getThumbnails();
                    List<RestaurantResponseDto.ThumbnailResponseDto> thumbnailResponseDtos = thumbnails.stream()
                            .map(RestaurantResponseDto.ThumbnailResponseDto::from)
                            .toList();
                    return RestaurantResponseDto.from(restaurant, thumbnailResponseDtos);
                }).collect(Collectors.toList());
    }

    public List<RestaurantResponseDto> searchRestaurantV2(double latitude, double longitude) {
        List<String> geoHashs = GeoHashUtil.getNeighbors(latitude, longitude, 6);
        return restaurantRepository.findRestaurantInRangeV2(geoHashs);
    }

    public List<RestaurantResponseDto> findAll() {
        return restaurantRepository.findAll()
                .stream()
                .map(restaurant -> RestaurantResponseDto.from(restaurant, List.of()))
                .toList();
    }
}
