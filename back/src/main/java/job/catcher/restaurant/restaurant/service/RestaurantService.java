package job.catcher.restaurant.restaurant.service;

import job.catcher.restaurant.global.response.RestaurantCrawlingDto;
import job.catcher.restaurant.global.util.GeoHashUtil;
import job.catcher.restaurant.restaurant.domain.Category;
import job.catcher.restaurant.restaurant.domain.Restaurant;
import job.catcher.restaurant.restaurant.dto.RestaurantResponseDto;
import job.catcher.restaurant.restaurant.repository.RestaurantRepository;
import job.catcher.restaurant.restaurant.repository.RestaurantRepositoryJooq;
import job.catcher.restaurant.thumbnail.domain.Thumbnail;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final RestaurantRepositoryJooq restaurantRepositoryJooq;

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

    public List<RestaurantResponseDto> searchRestaurantV3(double latitude, double longitude) {
        List<String> geoHashs = GeoHashUtil.getNeighbors(latitude, longitude, 6);
        return restaurantRepositoryJooq.findRestaurantInRangeV3(geoHashs);
    }

    public List<RestaurantResponseDto> findAll() {
        return restaurantRepository.findAll()
                .stream()
                .map(restaurant -> RestaurantResponseDto.from(restaurant, List.of()))
                .toList();
    }

    @Transactional
    public void updateGeoHash() {
        List<Restaurant> restaurants = restaurantRepository.findAll();
        for (Restaurant restaurant: restaurants) {
            String geoHash = GeoHashUtil.encode(restaurant.getLatitude(), restaurant.getLongitude(), 6);
            restaurant.updateGeoHash(geoHash);
        }
    }

    @Transactional
    public void saveOrUpdateCrawlingData(List<RestaurantCrawlingDto> restaurantCrawlingDtos) {
        if (restaurantCrawlingDtos.isEmpty()) {
            return;
        }
        // 1. googleId 리스트 추출
        List<String> googleIds = restaurantCrawlingDtos.stream()
                .map(RestaurantCrawlingDto::googleId)
                .toList();

        // 2. 한 번의 쿼리로 기존 데이터 조회
        List<Restaurant> existingRestaurants = restaurantRepository.findByGoogleIdIn(googleIds);

        // 3. 기존 데이터를 Map 형태로 변환 (googleId -> Restaurant)
        Map<String, Restaurant> existingRestaurantMap = existingRestaurants.stream()
                .collect(Collectors.toMap(Restaurant::getGoogleId, r -> r));

        // 4. 수정할 데이터 & 신규 데이터 분리
        List<Restaurant> toInsert = new ArrayList<>();

        for (RestaurantCrawlingDto dto : restaurantCrawlingDtos) {
            Restaurant restaurant = existingRestaurantMap.get(dto.googleId());

            if (restaurant != null) {
                // 기존 데이터 존재 -> 수정 대상
                restaurant.updateCrawlingData(dto.title(), dto.address(), dto.rating(), dto.reviewCount(), dto.visitedReviewCount());
            } else {
                // 기존 데이터 없음 -> 신규 삽입 대상
                Restaurant newRestaurant = Restaurant.builder()
                        .googleId(dto.googleId())
                        .title(dto.title())
                        .address(dto.address())
                        .latitude(dto.latitude())
                        .longitude(dto.longitude())
                        .geoHash(GeoHashUtil.encode(dto.latitude(), dto.longitude(), 6))
                        .rating(dto.rating() != null ? dto.rating() : 0.0)
                        .reviewCount(dto.reviewCount() != null ? dto.reviewCount() : 0)
                        .visitedReviewCount(dto.visitedReviewCount() != null ? dto.visitedReviewCount() : 0)
                        .category(Category.KOREA)
                        .build();
                toInsert.add(newRestaurant);
            }
        }

        // 5. Batch Insert 실행
        if (!toInsert.isEmpty()) {
            restaurantRepository.saveAll(toInsert);
        }
    }
}
