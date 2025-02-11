//package job.catcher.restaurant.global.batch;
//
//import job.catcher.restaurant.global.response.RestaurantCrawlingDto;
//import job.catcher.restaurant.global.service.CrawlingService;
//import job.catcher.restaurant.restaurant.repository.RestaurantRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Component;
//
//import java.util.List;
//
//@Component
//@RequiredArgsConstructor
//public class CrawlingBatchTask {
//
//    private final CrawlingService crawlingService;
//
//    private final RestaurantRepository restaurantRepository;
//
//    @Scheduled(cron = "0 0 0 * * ?")
//    public void runBatchTask() {
//        double latitude = 37.5665;
//        double longitude = 126.9780;
//
//        crawlingService.fetchRestaurantData(latitude, longitude)
//                .doOnNext(restaurants -> saveOrUpdateRestaurants(restaurants))
//                .doOnError(error -> System.err.println("크롤링 중 오류 발생: " + error.getMessage()))
//                .block(); // 배치 완료를 보장하기 위해 동기화
//    }
//
//    private void saveOrUpdateRestaurants(List<RestaurantCrawlingDto> restaurants) {
////        for (RestaurantCrawlingDto dto : restaurants) {
////            restaurantRepository.findByNameAndLatitudeAndLongitude(dto.getName(), dto.getLatitude(), dto.getLongitude())
////                    .ifPresentOrElse(
////                            existing -> {
////                                existing.setRating(dto.getRating());
////                                existing.setReviewCount(dto.getReviewCount());
////                                restaurantRepository.save(existing);
////                            },
////                            () -> {
////                                Restaurant newRestaurant = new Restaurant();
////                                newRestaurant.setName(dto.getName());
////                                newRestaurant.setLatitude(dto.getLatitude());
////                                newRestaurant.setLongitude(dto.getLongitude());
////                                newRestaurant.setRating(dto.getRating());
////                                newRestaurant.setReviewCount(dto.getReviewCount());
////                                restaurantRepository.save(newRestaurant);
////                            }
////                    );
//    }
//}
