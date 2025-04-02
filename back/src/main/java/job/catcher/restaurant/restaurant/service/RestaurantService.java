package job.catcher.restaurant.restaurant.service;

import job.catcher.restaurant.global.response.RestaurantCrawlingDto;
import job.catcher.restaurant.global.util.GeoHashUtil;
import job.catcher.restaurant.restaurant.domain.Category;
import job.catcher.restaurant.restaurant.domain.Restaurant;
import job.catcher.restaurant.restaurant.dto.RestaurantRequestDto;
import job.catcher.restaurant.restaurant.dto.RestaurantResponseDto;
import job.catcher.restaurant.restaurant.dto.RestaurantSyncResponseDto;
import job.catcher.restaurant.restaurant.repository.RestaurantRepository;
import job.catcher.restaurant.restaurant.repository.RestaurantRepositoryJooq;
import job.catcher.restaurant.thumbnail.domain.Thumbnail;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

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

    public List<RestaurantResponseDto> searchRestaurantV3Get(double latitude, double longitude) {
        List<String> geoHashs = GeoHashUtil.getNeighbors(latitude, longitude, 6);
        return restaurantRepositoryJooq.findRestaurantInRangeV3(geoHashs);
    }

    public RestaurantSyncResponseDto searchRestaurantV3Post(double latitude, double longitude, RestaurantRequestDto restaurantRequestDto) {
        List<String> geoHashs = GeoHashUtil.getNeighbors(latitude, longitude, 6);
        List<RestaurantResponseDto> restaurants = restaurantRepositoryJooq.findRestaurantInRangeV3(geoHashs);
        List<Long> restaurantIds = restaurantRequestDto.restaurantIds();

        List<Long> removeRestaurantIds = restaurantIds.stream()
                .filter(id -> restaurants.stream().noneMatch(r -> r.restaurantId() == id))
                .collect(Collectors.toList());
        restaurants.removeIf(restaurant -> restaurantIds.contains(restaurant.restaurantId()));

        return RestaurantSyncResponseDto.from(restaurants, removeRestaurantIds);
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
                Restaurant newRestaurant = dto.toEntity();
                toInsert.add(newRestaurant);
            }
        }

        // 5. Batch Insert 실행
        if (!toInsert.isEmpty()) {
            restaurantRepository.saveAll(toInsert);
        }
    }

//    @Transactional
//    public void saveOrUpdateAsync(List<RestaurantCrawlingDto> dtos) {
//        Flux.fromIterable(dtos)
//                .parallel()
//                .runOn(Schedulers.boundedElastic()) // 병렬 처리
//                .flatMap(dto -> Mono.fromCallable(() -> saveOrUpdate(dto)))
//                .sequential()
//                .subscribe();
//    }
//
//    private Restaurant saveOrUpdate(RestaurantCrawlingDto dto) {
//        return restaurantRepository.findByGoogleId(dto.googleId())
//                .map(restaurant -> {
//                    restaurant.updateCrawlingData(dto.title(), dto.address(), dto.rating(), dto.reviewCount(), dto.visitedReviewCount());
//                    return restaurant;
//                })
//                .orElseGet(() -> {
//                    Restaurant newRestaurant = dto.toEntity();
//                    return restaurantRepository.save(newRestaurant);
//                });
//    }

    @Transactional
    public void saveOrUpdateAsync(List<RestaurantCrawlingDto> dtos) {
        // 1. DB에서 googleId를 IN절로 조회
        List<String> googleIds = dtos.stream()
                .map(RestaurantCrawlingDto::googleId)
                .toList();
        List<Restaurant> existingRestaurants = restaurantRepository.findAllByGoogleIdIn(googleIds);

        // 2. Map<googleId, Restaurant> 형태로 변환
        Map<String, Restaurant> restaurantMap = existingRestaurants.stream()
                .collect(Collectors.toMap(Restaurant::getGoogleId, r -> r));

        // 3. 병렬로 저장 및 수정
        Flux.fromIterable(dtos)
                .parallel(4)
                .runOn(Schedulers.boundedElastic())
                .flatMap(dto -> Mono.fromCallable(() -> saveOrUpdate(restaurantMap, dto)))
                .sequential()
                .subscribe();
    }

    private Restaurant saveOrUpdate(Map<String, Restaurant> restaurantMap, RestaurantCrawlingDto dto) {
        if (restaurantMap.containsKey(dto.googleId())) {
            Restaurant restaurant = restaurantMap.get(dto.googleId());
            restaurant.updateCrawlingData(dto.title(), dto.address(), dto.rating(), dto.reviewCount(), dto.visitedReviewCount());
            return restaurant;
        } else {
            return restaurantRepository.save(dto.toEntity());
        }
    }
}
