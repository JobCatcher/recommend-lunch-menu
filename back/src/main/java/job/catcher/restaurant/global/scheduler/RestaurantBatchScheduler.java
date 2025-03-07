package job.catcher.restaurant.global.scheduler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Slf4j
@Component
public class RestaurantBatchScheduler {

    private static final String LOCK_KEY = "restaurant-batch-lock"; // Redis에 저장할 Lock Key
    private static final String LOCK_VALUE = "locked";
    private static final Duration LOCK_EXPIRATION = Duration.ofMinutes(30); // Lock 유지 시간

    private final RedisTemplate<String, String> redisTemplate;

    private final JobLauncher jobLauncher;

    private final Job restaurantJob;

    public RestaurantBatchScheduler(JobLauncher jobLauncher, @Qualifier("restaurantJob") Job restaurantJob, RedisTemplate<String, String> redisTemplate) {
        this.jobLauncher = jobLauncher;
        this.restaurantJob = restaurantJob;
        this.redisTemplate = redisTemplate;
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void runJob() {

        Boolean lockAcquired = redisTemplate.opsForValue().setIfAbsent(LOCK_KEY, LOCK_VALUE, LOCK_EXPIRATION);

        if (lockAcquired == null || !lockAcquired) {
            log.info("batch is already running on another server");
            return;
        }

        log.info("batch start");
        try {
            JobParameters params = new JobParametersBuilder()
                    .addLong("time", System.currentTimeMillis())
                    .toJobParameters();
            jobLauncher.run(restaurantJob, params);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            redisTemplate.delete(LOCK_KEY);
            log.info("batch finished");
        }
    }
}
