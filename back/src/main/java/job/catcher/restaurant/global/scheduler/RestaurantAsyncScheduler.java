package job.catcher.restaurant.global.scheduler;

import job.catcher.restaurant.global.service.CrawlingService;
import job.catcher.restaurant.restaurant.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Slf4j
@Component
@RequiredArgsConstructor
public class RestaurantAsyncScheduler {

    private static final String LOCK_KEY = "restaurant-async-lock"; // Redis에 저장할 Lock Key
    private static final String LOCK_VALUE = "locked";
    private static final Duration LOCK_EXPIRATION = Duration.ofMinutes(30); // Lock 유지 시간

    private final RedisTemplate<String, String> redisTemplate;

    private final CrawlingService crawlingService;
    private final RestaurantService restaurantService;

//    @Scheduled(fixedRate = 60000)
    @Scheduled(cron = "0 0 0 * * *")
    public void asyncCrawling() {

        Boolean lockAcquired = redisTemplate.opsForValue().setIfAbsent(LOCK_KEY, LOCK_VALUE, LOCK_EXPIRATION);

        if (lockAcquired == null || !lockAcquired) {
            log.info("scheduler is already running on another server");
            return;
        }

        log.info("scheduler start");
        try {
            double latitude = 37.378937695744746;
            double longitude = 127.11387857445837;

            crawlingService.fetchRestaurantData(latitude, longitude)
                    .doOnNext(restaurantService::saveOrUpdateAsync)
                    .doOnError(e -> System.err.println("Error during crawling: " + e.getMessage()))
                    .subscribe();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            redisTemplate.delete(LOCK_KEY);
            log.info("scheduler finished");
        }
    }
}
