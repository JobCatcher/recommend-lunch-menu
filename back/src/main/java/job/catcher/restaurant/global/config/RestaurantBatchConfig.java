package job.catcher.restaurant.global.config;

import job.catcher.restaurant.global.response.RestaurantCrawlingDto;
import job.catcher.restaurant.global.service.CrawlingService;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Configuration
@EnableBatchProcessing
@RequiredArgsConstructor
public class RestaurantBatchConfig {

    private final JobRepository jobRepository;

    private final PlatformTransactionManager transactionManager;

    private final CrawlingService crawlingService;

    @Bean
    public Job restaurantJob() {
        return new JobBuilder("restaurantJob", jobRepository)
                .start(crawlStep())
                .next(saveStep())
                .build();
    }

    @Bean
    public Step crawlStep() {
        return new StepBuilder("crawlStep", jobRepository)
                .tasklet(crawlTasklet(), transactionManager)
                .build();
    }

    @Bean
    public Step saveStep() {
        return new StepBuilder("saveStep", jobRepository)
                .tasklet(saveTasklet(), transactionManager)
                .build();
    }

    @Bean
    public Tasklet crawlTasklet() {
        System.out.println("//=== crawlTasklet ===//");
        return (contribution, chunkContext) -> {
            // 크롤링 로직 (HTTP GET 요청)
//            List<RestaurantCrawlingDto> restaurantCrawlingDtos = fetchRestaurantData();
            List<RestaurantCrawlingDto.data> restaurantCrawlingDtos = testFetchRestaurantData().data();
            // Step 간 데이터를 공유하기 위해 ExecutionContext에 저장
            chunkContext.getStepContext().getStepExecution().getJobExecution()
                    .getExecutionContext()
                    .put("restaurantData", restaurantCrawlingDtos);
            if (restaurantCrawlingDtos == null || restaurantCrawlingDtos.isEmpty()) {
                throw new RuntimeException("No data fetched from crawling.");
            }
            return RepeatStatus.FINISHED;
        };
    }

    @Bean
    public Tasklet saveTasklet() {
        System.out.println("//=== saveTasklet ===//");
        return (contribution, chunkContext) -> {
            // ExecutionContext에서 데이터 꺼내기
            List<RestaurantCrawlingDto> restaurantCrawlingDtos =
                    (List<RestaurantCrawlingDto>) chunkContext.getStepContext()
                            .getStepExecution()
                            .getJobExecution()
                            .getExecutionContext()
                            .get("restaurantData");
            if (restaurantCrawlingDtos == null || restaurantCrawlingDtos.isEmpty()) {
                throw new RuntimeException("No data found in ExecutionContext.");
            }
            // 비동기 저장 로직 호출
//            CompletableFuture.allOf(
//                    restaurantCrawlingDtos.stream()
//                            .map(dto -> CompletableFuture.runAsync(() -> saveOrUpdateToDatabase(dto)))
//                            .toArray(CompletableFuture[]::new)
//            ).join();

            return RepeatStatus.FINISHED;
        };
    }

    private List<RestaurantCrawlingDto> fetchRestaurantData() {
        double latitude = 37.378937695744746;
        double longitude = 127.11387857445837;
        // HTTP GET 요청 처리 (RestTemplate, WebClient 등 사용)
        // 데이터를 RestaurantDto List로 반환
        return crawlingService.fetchRestaurantData(latitude, longitude)
                .block();
    }

    private RestaurantCrawlingDto testFetchRestaurantData() {
        double latitude = 37.378937695744746;
        double longitude = 127.11387857445837;
        // HTTP GET 요청 처리 (RestTemplate, WebClient 등 사용)
        // 데이터를 RestaurantDto List로 반환
        return crawlingService.testFetchRestaurantData(latitude, longitude).blockFirst();
    }

    @Async
    private void saveOrUpdateToDatabase(RestaurantCrawlingDto restaurantCrawlingDto) {
        // JPA 또는 QueryDSL을 사용한 데이터 저장/업데이트 로직
        // 비동기 저장 로직 호출
    }
}
