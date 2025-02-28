package job.catcher.restaurant.global.scheduler;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class RestaurantBatchScheduler {

    private final JobLauncher jobLauncher;

    private final Job restaurantJob;

    public RestaurantBatchScheduler(JobLauncher jobLauncher, @Qualifier("restaurantJob") Job restaurantJob) {
        this.jobLauncher = jobLauncher;
        this.restaurantJob = restaurantJob;
    }

//    @Scheduled(cron = "*/59 * * * * *")
    public void runJob() {
        System.out.println("//=== RestaurantBatchScheduler ===//");
        try {
            JobParameters params = new JobParametersBuilder()
                    .addLong("time", System.currentTimeMillis())
                    .toJobParameters();
            jobLauncher.run(restaurantJob, params);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
